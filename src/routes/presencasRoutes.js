const router = require("express").Router();

const presencasController = require("../controllers/presencasController");
const { authorize } = require("../middlewares/auth");

router.get("/frequencia", presencasController.frequencia);
router.get("/", presencasController.list);
router.get("/:id", presencasController.getById);
router.post("/", authorize("admin", "gerente"), presencasController.create);
router.put("/:id", authorize("admin", "gerente"), presencasController.update);
router.delete("/:id", authorize("admin"), presencasController.remove);

module.exports = router;
