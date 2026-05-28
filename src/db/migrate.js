require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function migrate() {
  const migrationPath = path.join(__dirname, "migrations", "001_init.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");

  await pool.query(sql);
  await pool.end();

  console.log("Database migration completed.");
}

migrate().catch(async (error) => {
  console.error("Database migration failed:", error.message);
  await pool.end();
  process.exit(1);
});
