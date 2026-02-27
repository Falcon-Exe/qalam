const pool = require('./db');

async function inspectTable() {
    try {
        const [rows] = await pool.query('DESCRIBE gallery');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

inspectTable();
