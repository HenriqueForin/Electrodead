const pool = require("../db/pool");
const createCrudController = require("./crudControllerFactory");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { requireFields } = require("../utils/validators");

const base = createCrudController({
  table: "instrumentos",
  fields: ["nome", "modelo", "estado", "info"],
  required: ["nome"],
  orderBy: "nome"
});

const addMembro = asyncHandler(async (req, res) => {
  requireFields(req.body, ["membro_id"]);

  await pool.query(
    `INSERT INTO membro_instrumento (membro_id, instrumento_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [req.body.membro_id, req.params.id]
  );

  res.status(201).json({ membro_id: Number(req.body.membro_id), instrumento_id: Number(req.params.id) });
});

const removeMembro = asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    "DELETE FROM membro_instrumento WHERE membro_id = $1 AND instrumento_id = $2",
    [req.params.membroId, req.params.id]
  );

  if (rowCount === 0) throw httpError(404, "Vinculo nao encontrado");
  res.status(204).send();
});

const listMembros = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT m.*
     FROM membros m
     INNER JOIN membro_instrumento mi ON mi.membro_id = m.id
     WHERE mi.instrumento_id = $1
     ORDER BY m.nome`,
    [req.params.id]
  );

  res.json(rows);
});

module.exports = {
  ...base,
  addMembro,
  listMembros,
  removeMembro
};
