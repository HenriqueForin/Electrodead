const pool = require("../db/pool");
const httpError = require("../utils/httpError");

function buildInsert(table, data) {
  const keys = Object.keys(data);
  const columns = keys.join(", ");
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
  const values = keys.map((key) => data[key]);

  return {
    text: `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  };
}

function buildUpdate(table, id, data) {
  const keys = Object.keys(data);

  if (keys.length === 0) {
    throw httpError(400, "Nenhum campo enviado para atualizacao");
  }

  const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const values = keys.map((key) => data[key]);
  values.push(id);

  return {
    text: `UPDATE ${table} SET ${assignments} WHERE id = $${values.length} RETURNING *`,
    values
  };
}

async function list(table, orderBy = "id") {
  const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
  return rows;
}

async function findById(table, id) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return rows[0];
}

async function create(table, data) {
  const { text, values } = buildInsert(table, data);
  const { rows } = await pool.query(text, values);
  return rows[0];
}

async function update(table, id, data) {
  const { text, values } = buildUpdate(table, id, data);
  const { rows } = await pool.query(text, values);
  return rows[0];
}

async function remove(table, id) {
  const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return rowCount > 0;
}

module.exports = {
  create,
  findById,
  list,
  remove,
  update
};
