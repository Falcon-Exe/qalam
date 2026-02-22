const db = require('./server/db');

const seed = async () => {
    try {
        console.log('🌱 Seeding database with functional data...');

        // 1. Get Admin User ID
        const [users] = await db.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        const adminId = users[0]?.id || 1;

        // 2. Clear existing dynamic data (Optional: keep users)
        await db.execute('DELETE FROM announcements');
        await db.execute('DELETE FROM events');
        await db.execute('DELETE FROM funds');
        await db.execute('DELETE FROM polls');

        // 3. Seed Announcements
        const announcements = [
            ['Union General Body Meeting', 'All students must attend the general body meeting at Central Hall tomorrow 4:00 PM.', 'high', adminId],
            ['Science Fair Abstract Submission', 'Last date for abstract submission has been extended to Feb 25th.', 'medium', adminId],
            ['Batch Photo Session', 'Official batch photo session for 2022-2026 Batch scheduled for Monday.', 'low', adminId]
        ];
        for (const a of announcements) {
            await db.execute('INSERT INTO announcements (title, content, priority_tag, created_by) VALUES (?, ?, ?, ?)', a);
        }

        // 4. Seed Events
        const events = [
            ['Inter-College Tech Fest', 'Our college is hosting the annual tech fest. Volunteers needed.', '2026-02-28', 'Main Campus', adminId],
            ['Inter-Batch Football Match', 'Batch 06 vs Batch 05. Come and support!', '2026-03-05', 'Sports Ground', adminId],
            ['Web Development Workshop', 'Hands-on session on React and Node.js.', '2026-03-10', 'Lab 03', adminId]
        ];
        for (const e of events) {
            await db.execute('INSERT INTO events (title, description, event_date, venue, created_by) VALUES (?, ?, ?, ?, ?)', e);
        }

        // 5. Seed Funds
        const funds = [
            ['income', 5000, 'Monthly subscription collected - Batch 06', '2026-02-01', adminId],
            ['income', 2000, 'Emergency union fund contribution', '2026-02-15', adminId],
            ['expense', 450, 'Handout printing for general meeting', '2026-02-20', adminId]
        ];
        for (const f of funds) {
            await db.execute('INSERT INTO funds (type, amount, description, transaction_date, created_by) VALUES (?, ?, ?, ?, ?)', f);
        }

        // 6. Seed a Poll
        const [pollResult] = await db.execute('INSERT INTO polls (question, created_by) VALUES (?, ?)', ['Which topic should we cover in the next workshop?', adminId]);
        const pollId = pollResult.insertId;
        const options = ['Machine Learning', 'Cyber Security', 'Cloud Computing'];
        for (const opt of options) {
            await db.execute('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)', [pollId, opt]);
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
