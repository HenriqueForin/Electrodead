require("dotenv").config();

const pool = require("../src/db/pool");

const maxAttempts = Number(process.env.DB_WAIT_ATTEMPTS || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 1000);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase() {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      console.log("Database is ready.");
      return;
    } catch (error) {
      console.log(`Waiting for database (${attempt}/${maxAttempts}): ${error.message}`);
      await delay(delayMs);
    }
  }

  throw new Error("Database did not become ready in time.");
}

waitForDatabase()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
