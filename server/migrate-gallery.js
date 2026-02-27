const pool = require('./db');

async function migrate() {
    try {
        console.log('🚀 Starting Gallery Schema Alignment...');

        // 1. Rename event_tag to event_name
        await pool.query('ALTER TABLE gallery CHANGE COLUMN event_tag event_name VARCHAR(100)');
        console.log('✅ Renamed event_tag to event_name');

        // 2. Rename uploaded_by to created_by
        await pool.query('ALTER TABLE gallery CHANGE COLUMN uploaded_by created_by INT');
        console.log('✅ Renamed uploaded_by to created_by');

        // 3. Add gallery_date
        await pool.query('ALTER TABLE gallery ADD COLUMN gallery_date DATE AFTER event_name');
        console.log('✅ Added gallery_date column');

        console.log('✨ Gallery Alignment Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
        process.exit(1);
    }
}

migrate();
