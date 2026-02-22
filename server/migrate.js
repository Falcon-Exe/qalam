const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function migrate() {
    console.log('🚀 Starting Database Migration...');

    try {
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon, but ignore those inside strings
        // This is a simple split, works for most basic init scripts
        const statements = sql
            .split(/;\s*$/m)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} statements to execute.`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                await pool.query(statement);
                console.log(`[${i + 1}/${statements.length}] ✅ Success`);
            } catch (err) {
                console.error(`[${i + 1}/${statements.length}] ❌ Error:`, err.sqlMessage || err.message || err);
            }
        }

        console.log('\n✨ Migration Complete!');
        process.exit(0);
    } catch (err) {
        console.error('💥 Migration Failed:', err);
        process.exit(1);
    }
}

migrate();
