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
        console.log('🌱 Seeding student login details...');

        for (const student of students) {
            const username = student.id;
            const password = student.id;
            const fullname = student.name;

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Using ID as BOTH username and password as requested.

            await db.execute(
                `INSERT INTO users (username, password, role, fullname) 
                 VALUES (?, ?, 'student', ?) 
                 ON DUPLICATE KEY UPDATE 
                 password = VALUES(password), 
                 fullname = VALUES(fullname)`,
                [username, hashedPassword, fullname]
            );
            console.log(`✅ Seeded student: ${username} (${fullname})`);
        }

        console.log('✨ All students seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedStudents();
