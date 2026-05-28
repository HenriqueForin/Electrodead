const createCrudController = require("./crudControllerFactory");

module.exports = createCrudController({
  table: "membros",
  fields: ["nome", "data_nasc", "cpf", "telefone", "endereco", "funcao", "user_id"],
  required: ["nome"],
  orderBy: "nome"
});
