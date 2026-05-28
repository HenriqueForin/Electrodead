const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { requireFields } = require("../utils/validators");

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      login: user.login,
      roles: user.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

async function getUserWithRoles(userId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.login, COALESCE(array_agg(r.role) FILTER (WHERE r.role IS NOT NULL), '{}') AS roles
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE u.id = $1
     GROUP BY u.id`,
    [userId]
  );

  return rows[0];
}

const register = asyncHandler(async (req, res) => {
  requireFields(req.body, ["login", "senha"]);

  const roles = Array.isArray(req.body.roles) && req.body.roles.length > 0 ? req.body.roles : ["membro"];
  const hashedPassword = await bcrypt.hash(req.body.senha, 10);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const created = await client.query("INSERT INTO users (login, senha) VALUES ($1, $2) RETURNING id", [
      req.body.login,
      hashedPassword
    ]);

    for (const role of roles) {
      const roleResult = await client.query("SELECT id FROM roles WHERE role = $1", [role]);
      if (!roleResult.rows[0]) throw httpError(400, `Perfil invalido: ${role}`);

      await client.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [
        created.rows[0].id,
        roleResult.rows[0].id
      ]);
    }

    await client.query("COMMIT");

    const user = await getUserWithRoles(created.rows[0].id);
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") throw httpError(409, "Login ja cadastrado");
    throw error;
  } finally {
    client.release();
  }
});

const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ["login", "senha"]);

  const { rows } = await pool.query("SELECT id, login, senha FROM users WHERE login = $1", [req.body.login]);
  const userRecord = rows[0];

  if (!userRecord) throw httpError(401, "Credenciais invalidas");

  const validPassword = await bcrypt.compare(req.body.senha, userRecord.senha);
  if (!validPassword) throw httpError(401, "Credenciais invalidas");

  const user = await getUserWithRoles(userRecord.id);
  res.json({ user, token: signToken(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await getUserWithRoles(req.user.id);
  res.json(user);
});

module.exports = {
  login,
  me,
  register
};
