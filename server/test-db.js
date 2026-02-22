const pool = require('./db');

async function test() {
    console.log('🔍 Testing Connection...');
    console.log('Host:', process.env.DB_HOST || process.env.MYSQLHOST);
    console.log('User:', process.env.DB_USER || process.env.MYSQLUSER);
    console.log('Database:', process.env.DB_NAME || process.env.MYSQLDATABASE);
    console.log('Port:', process.env.DB_PORT || process.env.MYSQLPORT);

    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ Connection Successful! Result:', rows[0].result);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.sqlMessage || err.message);
        process.exit(1);
    }
}

test();
