const createCrudController = require("./crudControllerFactory");

module.exports = createCrudController({
  table: "ingressos",
  fields: ["evento_id", "tipo", "meta", "quantd_vendida", "preco"],
  required: ["evento_id", "tipo"],
  orderBy: "id DESC"
});
