const httpError = require("./httpError");

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");

  if (missing.length > 0) {
    throw httpError(400, `Campos obrigatorios ausentes: ${missing.join(", ")}`);
  }
}

function pick(body, fields) {
  return fields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field];
    return data;
  }, {});
}

module.exports = {
  pick,
  requireFields
};
