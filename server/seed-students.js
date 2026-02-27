const db = require('./db');
const bcrypt = require('bcryptjs');

const students = [
    { id: "20194", name: "ABDUL SAMAD S" },
    { id: "20195", name: "AHMAD MIQDAD K P" },
    { id: "20196", name: "MUHAMMAD ARIF" },
    { id: "20198", name: "HARSHAD P" },
    { id: "20204", name: "MUHAMMED SHAHID" },
    { id: "20206", name: "MUHAMMED NIHAL" },
    { id: "20210", name: "SALMANUL FARIS UK" },
    { id: "20213", name: "MUHAMMED MIRAZ P M" },
    { id: "20214", name: "AHAMMED ASHFAK K A" },
    { id: "20497", name: "MUHAMMAD HABEEB S" },
    { id: "20498", name: "MUHAMMED FARIS CA" },
    { id: "20511", name: "MOHAMMED JIRSHAD PK" },
    { id: "20525", name: "MAHMOOD FAYIS E" },
    { id: "20527", name: "MUJEEB RAHMAN K" },
    { id: "20529", name: "DILSHAD MUHAMMED" },
    { id: "20532", name: "MUHAMMED SABIR.C" },
    { id: "20533", name: "MUHAMMED HISHAM" },
    { id: "20891", name: "MUHAMMAD RAFIH" },
    { id: "20899", name: "MARUWAN S" },
    { id: "20901", name: "ALTHAF" },
    { id: "20905", name: "ABDUL RASAK. V" },
    { id: "20909", name: "MUHAMMED MINHAJ MT" },
    { id: "20911", name: "MUHAMMAD AFINAS" },
    { id: "20915", name: "MUHAMMED SINAN" },
    { id: "20916", name: "MUHAMMED SANAD" }
];

const seedStudents = async () => {
    try {
        console.log('🌱 Starting final robust student login update...');

        // 1. Delete the numeric-username students (only duplicates)
        // We'll be very specific: delete if numeric username AND role is student
        await db.execute("DELETE FROM users WHERE role = 'student' AND username REGEXP '^[0-9]+$'");

        for (const student of students) {
            const id = student.id;
            const name = student.name;
            const hashedPassword = await bcrypt.hash(id, 10);

            // 2. Check if a user with this ID (username) already exists (could be admin)
            const [idRows] = await db.execute("SELECT id, role FROM users WHERE username = ?", [id]);

            if (idRows.length > 0) {
                // User with this ID exists. Update their role to student and update password.
                const userId = idRows[0].id;
                await db.execute(
                    "UPDATE users SET role = 'student', password = ?, fullname = ? WHERE id = ?",
                    [hashedPassword, name, userId]
                );
                console.log(`✅ Updated existing user by ID: ${id} (${name})`);

                // Also cleanup any student record with this name as username to avoid duplicates
                await db.execute("DELETE FROM users WHERE fullname = ? AND username = ? AND role = 'student'", [name, name]);
            } else {
                // 3. Check if user exists by fullname
                const [nameRows] = await db.execute("SELECT id FROM users WHERE fullname = ? AND role = 'student' LIMIT 1", [name]);

                if (nameRows.length > 0) {
                    const userId = nameRows[0].id;
                    await db.execute(
                        "UPDATE users SET username = ?, password = ? WHERE id = ?",
                        [id, hashedPassword, userId]
                    );
                    console.log(`✅ Updated existing student by Name: ${name} -> ID: ${id}`);
                } else {
                    // Insert as new
                    await db.execute(
                        "INSERT INTO users (username, password, role, fullname) VALUES (?, ?, 'student', ?)",
                        [id, hashedPassword, name]
                    );
                    console.log(`✨ Created new student: ${name} (ID: ${id})`);
                }
            }
        }

        console.log('🎉 Production database successfully synchronized!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Update failed:', err);
        process.exit(1);
    }
};

seedStudents();
