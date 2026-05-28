const crud = require("../repositories/crudRepository");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { pick, requireFields } = require("../utils/validators");

function createCrudController({ table, fields, required = [], orderBy = "id" }) {
  const list = asyncHandler(async (_req, res) => {
    res.json(await crud.list(table, orderBy));
  });

  const getById = asyncHandler(async (req, res) => {
    const record = await crud.findById(table, req.params.id);
    if (!record) throw httpError(404, "Registro nao encontrado");
    res.json(record);
  });

  const create = asyncHandler(async (req, res) => {
    requireFields(req.body, required);
    const record = await crud.create(table, pick(req.body, fields));
    res.status(201).json(record);
  });

  const update = asyncHandler(async (req, res) => {
    const record = await crud.update(table, req.params.id, pick(req.body, fields));
    if (!record) throw httpError(404, "Registro nao encontrado");
    res.json(record);
  });

  const remove = asyncHandler(async (req, res) => {
    const removed = await crud.remove(table, req.params.id);
    if (!removed) throw httpError(404, "Registro nao encontrado");
    res.status(204).send();
  });

  return {
    create,
    getById,
    list,
    remove,
    update
  };
}

module.exports = createCrudController;
