const pool = require('./db');

async function checkData() {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery LIMIT 5');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkData();
