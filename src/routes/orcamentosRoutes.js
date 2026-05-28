const router = require("express").Router();

const orcamentosController = require("../controllers/orcamentosController");
const { authorize } = require("../middlewares/auth");

router.get("/resumo", orcamentosController.resumo);
router.get("/", orcamentosController.list);
router.get("/:id", orcamentosController.getById);
router.post("/", authorize("admin", "gerente"), orcamentosController.create);
router.put("/:id", authorize("admin", "gerente"), orcamentosController.update);
router.delete("/:id", authorize("admin"), orcamentosController.remove);

module.exports = router;
