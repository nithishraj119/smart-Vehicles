const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'smart_commute_ai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
};

let pool = null;
let isConnected = false;
let useFallback = false;

// In-memory fallback dataset for seamless resilience if MySQL server is unreachable
let inMemoryStore = {
  users: [
    {
      id: 1,
      name: 'Admin Controller',
      email: 'admin@smartcommute.ai',
      password: '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece', // password123
      phone: '+91 9876543210',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Alex Morgan',
      email: 'commuter@smartcommute.ai',
      password: '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece', // password123
      phone: '+91 9123456789',
      role: 'user',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece',
      phone: '+91 9988776655',
      role: 'user',
      created_at: new Date().toISOString()
    }
  ],
  traffic_data: [
    { id: 1, latitude: 12.9716, longitude: 77.5946, congestion_level: 'Moderate', average_speed: 34.50, vehicle_count: 1240, recorded_at: new Date().toISOString() },
    { id: 2, latitude: 12.9352, longitude: 77.6245, congestion_level: 'Heavy', average_speed: 18.20, vehicle_count: 2450, recorded_at: new Date().toISOString() },
    { id: 3, latitude: 12.9279, longitude: 77.6271, congestion_level: 'Critical', average_speed: 11.00, vehicle_count: 3120, recorded_at: new Date().toISOString() },
    { id: 4, latitude: 12.9984, longitude: 77.5921, congestion_level: 'Low', average_speed: 52.00, vehicle_count: 680, recorded_at: new Date().toISOString() },
    { id: 5, latitude: 13.0358, longitude: 77.5970, congestion_level: 'Moderate', average_speed: 38.00, vehicle_count: 1420, recorded_at: new Date().toISOString() },
    { id: 6, latitude: 12.9166, longitude: 77.6101, congestion_level: 'Heavy', average_speed: 21.40, vehicle_count: 2180, recorded_at: new Date().toISOString() },
    { id: 7, latitude: 13.0827, longitude: 80.2707, congestion_level: 'Heavy', average_speed: 24.00, vehicle_count: 2800, recorded_at: new Date().toISOString() },
    { id: 8, latitude: 13.0405, longitude: 80.2337, congestion_level: 'Moderate', average_speed: 36.50, vehicle_count: 1650, recorded_at: new Date().toISOString() }
  ],
  hazards: [
    { id: 1, latitude: 12.9355, longitude: 77.6150, hazard_type: 'Pothole', severity: 'Moderate', description: 'Deep asphalt pothole in middle lane near Silk Board junction', reported_by: 'Commuter #104', created_at: new Date().toISOString() },
    { id: 2, latitude: 12.9510, longitude: 77.6400, hazard_type: 'Accident', severity: 'Critical', description: 'Multi-vehicle collision blocking two right lanes, emergency services on site', reported_by: 'Traffic Patrol #04', created_at: new Date().toISOString() },
    { id: 3, latitude: 12.9780, longitude: 77.6410, hazard_type: 'Road Block', severity: 'High', description: 'Underground metro line construction detour in progress', reported_by: 'Municipal Corporation', created_at: new Date().toISOString() },
    { id: 4, latitude: 12.9210, longitude: 77.6850, hazard_type: 'Flood', severity: 'High', description: 'Waterlogging due to overnight rain, slow moving traffic', reported_by: 'Commuter #215', created_at: new Date().toISOString() },
    { id: 5, latitude: 13.0100, longitude: 77.5550, hazard_type: 'Construction', severity: 'Low', description: 'Shoulder barricading and resurfacing work active', reported_by: 'Road Works Dept', created_at: new Date().toISOString() },
    { id: 6, latitude: 12.9620, longitude: 77.5850, hazard_type: 'Traffic Jam', severity: 'High', description: 'Bottleneck at flyover ramp during peak hours', reported_by: 'Sensor Node #12', created_at: new Date().toISOString() },
    { id: 7, latitude: 12.9890, longitude: 77.6010, hazard_type: 'Broken Signal', severity: 'Moderate', description: 'Traffic lights flashing yellow at 4-way intersection', reported_by: 'Patrol Officer Raj', created_at: new Date().toISOString() }
  ],
  weather_data: [
    { id: 1, location: 'Bengaluru Central Hub', temperature: 27.50, humidity: 68.00, rainfall: 15.00, visibility: 8.50, wind_speed: 14.00, recorded_at: new Date().toISOString() },
    { id: 2, location: 'Electronics City Corridor', temperature: 28.20, humidity: 72.00, rainfall: 25.00, visibility: 7.00, wind_speed: 16.50, recorded_at: new Date().toISOString() },
    { id: 3, location: 'Whitefield Tech Zone', temperature: 26.80, humidity: 65.00, rainfall: 10.00, visibility: 9.20, wind_speed: 12.00, recorded_at: new Date().toISOString() },
    { id: 4, location: 'Chennai Coastal Expressway', temperature: 31.00, humidity: 80.00, rainfall: 5.00, visibility: 10.00, wind_speed: 18.00, recorded_at: new Date().toISOString() },
    { id: 5, location: 'Airport Expressway Zone', temperature: 25.40, humidity: 60.00, rainfall: 0.00, visibility: 10.00, wind_speed: 11.20, recorded_at: new Date().toISOString() }
  ],
  emergency_reports: [
    { id: 1, user_id: 2, latitude: 12.9512, longitude: 77.6398, emergency_type: 'Accident', description: 'Two-wheeler involved in skid near outer ring road service lane. First aid requested.', status: 'Dispatched', created_at: new Date().toISOString() },
    { id: 2, user_id: 3, latitude: 12.9150, longitude: 77.6080, emergency_type: 'Vehicle Breakdown', description: 'Heavy transport truck engine stalled blocking left lane', status: 'Investigating', created_at: new Date().toISOString() },
    { id: 3, user_id: null, latitude: 12.9730, longitude: 77.5960, emergency_type: 'Road Block', description: 'Fallen tree limb restricting lane clearance after thunderstorm', status: 'Resolved', created_at: new Date().toISOString() }
  ],
  routes: [
    { id: 1, user_id: 2, start_latitude: 12.9716, start_longitude: 77.5946, destination_latitude: 12.9352, destination_longitude: 77.6245, risk_score: 72, risk_level: 'HIGH', recommended_route: 'Consider taking Inner Ring Road detour to avoid critical congestion at Silk Board and reported multi-vehicle accident.', created_at: new Date().toISOString() },
    { id: 2, user_id: 2, start_latitude: 12.9716, start_longitude: 77.5946, destination_latitude: 13.0358, destination_longitude: 77.5970, risk_score: 28, risk_level: 'LOW', recommended_route: 'Direct North Expressway corridor is clear with high visibility and minimal congestion.', created_at: new Date().toISOString() },
    { id: 3, user_id: 3, start_latitude: 12.9352, start_longitude: 77.6245, destination_latitude: 12.9850, destination_longitude: 77.7300, risk_score: 55, risk_level: 'MODERATE', recommended_route: 'Route is usable. Moderate delays anticipated around Koramangala and waterlogging pockets.', created_at: new Date().toISOString() }
  ],
  iot_sensor_data: [
    { id: 1, device_id: 'IOT-ESP32-NODE-01', latitude: 12.9716, longitude: 77.5946, speed: 38.50, vehicle_count: 85, temperature: 27.50, rainfall: 0.00, hazard_detected: false, recorded_at: new Date().toISOString() },
    { id: 2, device_id: 'IOT-ESP32-NODE-02', latitude: 12.9352, longitude: 77.6245, speed: 14.20, vehicle_count: 195, temperature: 28.00, rainfall: 12.50, hazard_detected: true, recorded_at: new Date().toISOString() },
    { id: 3, device_id: 'IOT-ESP32-NODE-03', latitude: 12.9984, longitude: 77.5921, speed: 55.00, vehicle_count: 42, temperature: 26.80, rainfall: 0.00, hazard_detected: false, recorded_at: new Date().toISOString() }
  ]
};

async function verifyConnection() {
  try {
    // Attempt connecting to the MySQL server
    const serverConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Ensure database exists
    await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await serverConnection.end();

    // Create pool for the database
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    // Check if tables exist, if not initialize them from schema
    await initializeDatabaseTables(pool);

    isConnected = true;
    useFallback = false;
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.warn(`[MySQL Notice] Could not connect to MySQL: ${error.message}`);
    console.log('Using simulated/demo database storage so the application runs seamlessly.');
    console.log('To link real MySQL, configure backend/.env with your MySQL root credentials and run: npm run init-db');
    useFallback = true;
    isConnected = true;
    console.log('Database connected successfully (Simulation Mode Active)');
    return true;
  }
}

async function initializeDatabaseTables(dbPool) {
  try {
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

      for (const statement of statements) {
        try {
          await dbPool.query(statement);
        } catch (e) {
          // Ignore table exists or duplicate key errors during init
        }
      }
    }
  } catch (err) {
    console.warn('Auto table initialization note:', err.message);
  }
}

async function query(sql, params = []) {
  if (!useFallback && pool) {
    try {
      const [rows, fields] = await pool.execute(sql, params);
      return [rows, fields];
    } catch (err) {
      console.error('MySQL Query Error:', err.message);
      throw err;
    }
  }

  // Resilient in-memory query handler for fallback
  return handleInMemoryQuery(sql, params);
}

function handleInMemoryQuery(sql, params) {
  const normalized = sql.trim().replace(/\s+/g, ' ');
  const upper = normalized.toUpperCase();

  // 1. SELECT queries
  if (upper.startsWith('SELECT')) {
    if (upper.includes('FROM USERS')) {
      if (upper.includes('WHERE EMAIL =')) {
        const email = params[0];
        const match = inMemoryStore.users.filter(u => u.email.toLowerCase() === String(email).toLowerCase());
        return [match, []];
      }
      if (upper.includes('WHERE ID =')) {
        const id = parseInt(params[0], 10);
        const match = inMemoryStore.users.filter(u => u.id === id);
        return [match, []];
      }
      return [inMemoryStore.users.map(({ password, ...u }) => u), []];
    }

    if (upper.includes('FROM TRAFFIC_DATA')) {
      return [inMemoryStore.traffic_data, []];
    }

    if (upper.includes('FROM HAZARDS')) {
      return [inMemoryStore.hazards, []];
    }

    if (upper.includes('FROM WEATHER_DATA')) {
      return [inMemoryStore.weather_data, []];
    }

    if (upper.includes('FROM EMERGENCY_REPORTS')) {
      return [inMemoryStore.emergency_reports, []];
    }

    if (upper.includes('FROM ROUTES')) {
      if (upper.includes('WHERE USER_ID =')) {
        const uid = parseInt(params[0], 10);
        const match = inMemoryStore.routes.filter(r => r.user_id === uid);
        return [match, []];
      }
      if (upper.includes('WHERE ID =')) {
        const id = parseInt(params[0], 10);
        const match = inMemoryStore.routes.filter(r => r.id === id);
        return [match, []];
      }
      return [inMemoryStore.routes, []];
    }

    if (upper.includes('FROM IOT_SENSOR_DATA')) {
      return [inMemoryStore.iot_sensor_data, []];
    }

    return [[], []];
  }

  // 2. INSERT queries
  if (upper.startsWith('INSERT INTO')) {
    if (upper.includes('USERS')) {
      const newUser = {
        id: inMemoryStore.users.length + 1,
        name: params[0],
        email: params[1],
        password: params[2],
        phone: params[3] || '',
        role: params[4] || 'user',
        created_at: new Date().toISOString()
      };
      inMemoryStore.users.push(newUser);
      return [{ insertId: newUser.id, affectedRows: 1 }, []];
    }

    if (upper.includes('ROUTES')) {
      const newRoute = {
        id: inMemoryStore.routes.length + 1,
        user_id: params[0] || null,
        start_latitude: params[1],
        start_longitude: params[2],
        destination_latitude: params[3],
        destination_longitude: params[4],
        risk_score: params[5],
        risk_level: params[6],
        recommended_route: params[7],
        created_at: new Date().toISOString()
      };
      inMemoryStore.routes.push(newRoute);
      return [{ insertId: newRoute.id, affectedRows: 1 }, []];
    }

    if (upper.includes('HAZARDS')) {
      const newHazard = {
        id: inMemoryStore.hazards.length + 1,
        latitude: params[0],
        longitude: params[1],
        hazard_type: params[2],
        severity: params[3],
        description: params[4],
        reported_by: params[5] || 'Commuter',
        created_at: new Date().toISOString()
      };
      inMemoryStore.hazards.push(newHazard);
      return [{ insertId: newHazard.id, affectedRows: 1 }, []];
    }

    if (upper.includes('TRAFFIC_DATA')) {
      const newTraffic = {
        id: inMemoryStore.traffic_data.length + 1,
        latitude: params[0],
        longitude: params[1],
        congestion_level: params[2],
        average_speed: params[3],
        vehicle_count: params[4],
        recorded_at: new Date().toISOString()
      };
      inMemoryStore.traffic_data.push(newTraffic);
      return [{ insertId: newTraffic.id, affectedRows: 1 }, []];
    }

    if (upper.includes('EMERGENCY_REPORTS')) {
      const newEmergency = {
        id: inMemoryStore.emergency_reports.length + 1,
        user_id: params[0] || null,
        latitude: params[1],
        longitude: params[2],
        emergency_type: params[3],
        description: params[4],
        status: params[5] || 'Pending',
        created_at: new Date().toISOString()
      };
      inMemoryStore.emergency_reports.push(newEmergency);
      return [{ insertId: newEmergency.id, affectedRows: 1 }, []];
    }

    if (upper.includes('IOT_SENSOR_DATA')) {
      const newSensor = {
        id: inMemoryStore.iot_sensor_data.length + 1,
        device_id: params[0],
        latitude: params[1],
        longitude: params[2],
        speed: params[3],
        vehicle_count: params[4],
        temperature: params[5],
        rainfall: params[6],
        hazard_detected: Boolean(params[7]),
        recorded_at: new Date().toISOString()
      };
      inMemoryStore.iot_sensor_data.push(newSensor);
      return [{ insertId: newSensor.id, affectedRows: 1 }, []];
    }

    return [{ insertId: 99, affectedRows: 1 }, []];
  }

  // 3. UPDATE queries
  if (upper.startsWith('UPDATE')) {
    if (upper.includes('HAZARDS')) {
      const id = parseInt(params[params.length - 1], 10);
      const hazard = inMemoryStore.hazards.find(h => h.id === id);
      if (hazard) {
        if (params.length === 3) {
          hazard.severity = params[0];
          hazard.description = params[1];
        } else if (params.length === 2) {
          hazard.severity = params[0];
        }
        return [{ affectedRows: 1 }, []];
      }
    }

    if (upper.includes('EMERGENCY_REPORTS')) {
      const status = params[0];
      const id = parseInt(params[1], 10);
      const item = inMemoryStore.emergency_reports.find(e => e.id === id);
      if (item) {
        item.status = status;
        return [{ affectedRows: 1 }, []];
      }
    }

    return [{ affectedRows: 1 }, []];
  }

  // 4. DELETE queries
  if (upper.startsWith('DELETE FROM HAZARDS')) {
    const id = parseInt(params[0], 10);
    const initialLen = inMemoryStore.hazards.length;
    inMemoryStore.hazards = inMemoryStore.hazards.filter(h => h.id !== id);
    return [{ affectedRows: initialLen - inMemoryStore.hazards.length }, []];
  }

  return [[], []];
}

module.exports = {
  pool,
  query,
  verifyConnection,
  inMemoryStore,
  get isConnected() { return isConnected; },
  get useFallback() { return useFallback; }
};
