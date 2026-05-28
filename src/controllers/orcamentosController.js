const pool = require("../db/pool");
const createCrudController = require("./crudControllerFactory");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController({
  table: "orcamentos",
  fields: ["evento_id", "tipo", "data", "descricao", "quantia"],
  required: ["tipo", "quantia"],
  orderBy: "data DESC"
});

const resumo = asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN tipo = 'credito' THEN quantia ELSE 0 END), 0) AS creditos,
       COALESCE(SUM(CASE WHEN tipo = 'debito' THEN quantia ELSE 0 END), 0) AS debitos,
       COALESCE(SUM(CASE WHEN tipo = 'credito' THEN quantia ELSE -quantia END), 0) AS saldo
     FROM orcamentos`
  );

  res.json(rows[0]);
});

module.exports = {
  ...base,
  resumo
};
