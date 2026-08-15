const bcrypt = require("bcryptjs");
const db = require("./config/database");

const name = "Main Admin";
const email = "admin1@gmail.com";
const password = "Admin@321";
const address = "Pune, Maharashtra";
const role = "System Administrator";

const hashedPassword = bcrypt.hashSync(password, 10);

const sql = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
`;

db.query(
    sql,
    [name, email, hashedPassword, address, role],
    (err, result) => {

        if (err) {
            console.error("Error creating admin:", err.message);
            return;
        }

        console.log("System Administrator created successfully.....");
        console.log("Admin ID:", result.insertId);

        db.end();
    }
);