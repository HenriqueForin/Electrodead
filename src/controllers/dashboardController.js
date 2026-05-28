const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");

const resumo = asyncHandler(async (_req, res) => {
  const [membros, instrumentos, eventos, ingressos, financeiro] = await Promise.all([
    pool.query("SELECT COUNT(*)::INT AS total FROM membros"),
    pool.query("SELECT COUNT(*)::INT AS total FROM instrumentos"),
    pool.query("SELECT COUNT(*)::INT AS total FROM eventos"),
    pool.query(
      `SELECT
         COALESCE(SUM(meta), 0)::INT AS meta_total,
         COALESCE(SUM(quantd_vendida), 0)::INT AS vendidos,
         COALESCE(SUM(quantd_vendida * preco), 0) AS valor_previsto
       FROM ingressos`
    ),
    pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN tipo = 'credito' THEN quantia ELSE -quantia END), 0) AS saldo
       FROM orcamentos`
    )
  ]);

  res.json({
    membros: membros.rows[0].total,
    instrumentos: instrumentos.rows[0].total,
    eventos: eventos.rows[0].total,
    ingressos: ingressos.rows[0],
    saldo_orcamento: financeiro.rows[0].saldo
  });
});

module.exports = {
  resumo
};
