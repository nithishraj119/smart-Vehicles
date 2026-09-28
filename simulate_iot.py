#!/usr/bin/env python3
"""
SMART-COMMUTE AI: IoT Edge Device Telemetry Simulator
Simulates roadside IoT microcontrollers (ESP32/Raspberry Pi) transmitting
traffic density, velocity, weather, and road hazard sensor readings to the
SMART-COMMUTE AI Node.js backend (/api/iot/sensor-data).
"""

import time
import random
import requests
import sys

API_URL = "http://localhost:5000/api/iot/sensor-data"

NODES = [
    {"id": "ESP32-STATION-BLR-01", "lat": 12.9716, "lng": 77.5946, "name": "MG Road Corridor"},
    {"id": "ESP32-STATION-BLR-02", "lat": 12.9352, "lng": 77.6245, "name": "Koramangala 80ft Road"},
    {"id": "ESP32-STATION-BLR-03", "lat": 12.9279, "lng": 77.6271, "name": "Silk Board Junction"},
    {"id": "ESP32-STATION-BLR-04", "lat": 12.9815, "lng": 77.6408, "name": "Indiranagar 100ft Road"},
]

def generate_telemetry(node):
    # Simulate realistic commuter corridor telemetry
    speed = round(random.uniform(12.0, 65.0), 1)
    vehicle_count = random.randint(25, 220)
    temperature = round(random.uniform(24.0, 34.0), 1)
    rainfall = round(random.choice([0.0, 0.0, 2.5, 8.0, 18.0]), 1)
    
    # 10% chance of sudden hazard anomaly (collision / obstacle)
    hazard_detected = random.random() < 0.10

    return {
        "device_id": node["id"],
        "latitude": round(node["lat"] + random.uniform(-0.002, 0.002), 6),
        "longitude": round(node["lng"] + random.uniform(-0.002, 0.002), 6),
        "speed": speed,
        "vehicle_count": vehicle_count,
        "temperature": temperature,
        "rainfall": rainfall,
        "hazard_detected": hazard_detected
    }

def send_telemetry(payload):
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        if response.status_code in (200, 201):
            data = response.json()
            print(f"[SUCCESS] Node: {payload['device_id']} | Speed: {payload['speed']} km/h | "
                  f"Vehicles: {payload['vehicle_count']} | Congestion: {data.get('data', {}).get('congestion_computed')} | "
                  f"Hazard: {payload['hazard_detected']}")
        else:
            print(f"[HTTP {response.status_code}] Failed: {response.text}")
    except requests.exceptions.ConnectionError:
        print("[WARNING] Could not connect to backend server at http://localhost:5000.")
        print("          Ensure backend is running with `cd backend && npm run dev`.")
    except Exception as e:
        print(f"[ERROR] Telemetry push error: {e}")

def main():
    print("=" * 70)
    print("  SMART-COMMUTE AI - IoT Roadside Sensor Telemetry Simulator")
    print(f"  Target Endpoint: {API_URL}")
    print("  Press Ctrl+C to stop simulation.")
    print("=" * 70)

    # Allow single test transmission or continuous simulation loop
    continuous = "--once" not in sys.argv

    try:
        while True:
            for node in NODES:
                payload = generate_telemetry(node)
                send_telemetry(payload)
                time.sleep(1.5)
            
            if not continuous:
                break

            print("\n--- Waiting 10 seconds for next telemetry cycle ---\n")
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n[STOPPED] IoT telemetry simulation halted by user.")

if __name__ == "__main__":
    main()
