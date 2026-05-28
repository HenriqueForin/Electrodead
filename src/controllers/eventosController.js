const createCrudController = require("./crudControllerFactory");

module.exports = createCrudController({
  table: "eventos",
  fields: ["titulo", "data", "local", "valor_recebido"],
  required: ["titulo", "data"],
  orderBy: "data DESC"
});
