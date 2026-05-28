require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../src/db/pool");

async function createAdmin() {
  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD || "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await pool.query(
    `INSERT INTO users (login, senha)
     VALUES ($1, $2)
     ON CONFLICT (login) DO UPDATE SET senha = EXCLUDED.senha
     RETURNING id, login`,
    [login, hashedPassword]
  );

  const role = await pool.query("SELECT id FROM roles WHERE role = $1", ["admin"]);

  await pool.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [user.rows[0].id, role.rows[0].id]
  );

  console.log(`Usuario criado: ${login} / ${password}`);
}

createAdmin()
  .catch((error) => {
    console.error("Erro ao criar admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
