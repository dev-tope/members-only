const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool ({
  // host: process.env.DBHOST,
  // database: process.env.DBNAME,
  // username: process.env.DBUSER,
  // password: process.env.DBPASSWORD,
  // port: process.env.DBPORT
  connectionString: process.env.DATBASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const results = await pool.query("SELECT NOW()");
    console.log("Connected to DB:", results.rows[0]);
  }catch(error) {
    console.error("Database connection error", err)
  }
})()

module.exports = pool;