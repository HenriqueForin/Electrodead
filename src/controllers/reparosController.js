const createCrudController = require("./crudControllerFactory");

module.exports = createCrudController({
  table: "reparos",
  fields: ["instrumento_id", "descricao", "data_reparo", "custo"],
  required: ["instrumento_id", "descricao"],
  orderBy: "data_reparo DESC"
});
