const pool = require("../db/pool");
const createCrudController = require("./crudControllerFactory");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController({
  table: "presencas",
  fields: ["membro_id", "data_presenca", "tipo", "presente", "observacao"],
  required: ["membro_id", "data_presenca", "tipo"],
  orderBy: "data_presenca DESC"
});

const frequencia = asyncHandler(async (req, res) => {
  const params = [];
  const filters = [];

  if (req.query.membro_id) {
    params.push(req.query.membro_id);
    filters.push(`p.membro_id = $${params.length}`);
  }

  if (req.query.data_inicio) {
    params.push(req.query.data_inicio);
    filters.push(`p.data_presenca >= $${params.length}`);
  }

  if (req.query.data_fim) {
    params.push(req.query.data_fim);
    filters.push(`p.data_presenca <= $${params.length}`);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `SELECT
       m.id AS membro_id,
       m.nome,
       COUNT(p.id)::INT AS total_registros,
       COUNT(*) FILTER (WHERE p.presente = TRUE)::INT AS total_presencas,
       COUNT(*) FILTER (WHERE p.presente = FALSE)::INT AS total_faltas,
       ROUND(
         CASE WHEN COUNT(p.id) = 0 THEN 0
         ELSE (COUNT(*) FILTER (WHERE p.presente = TRUE)::NUMERIC / COUNT(p.id)) * 100 END,
         2
       ) AS percentual_presenca
     FROM membros m
     LEFT JOIN presencas p ON p.membro_id = m.id
     ${where}
     GROUP BY m.id, m.nome
     ORDER BY m.nome`,
    params
  );

  res.json(rows);
});

module.exports = {
  ...base,
  frequencia
};
