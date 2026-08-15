const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT

});

db.connect((err) => {
    if(err)
    {
        console.error("Database Connection failed....",err.message);
        return
    }
        console.log("Database Connection Successfull...");
});


module.exports =db;