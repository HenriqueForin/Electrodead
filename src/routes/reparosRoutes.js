const router = require("express").Router();

const reparosController = require("../controllers/reparosController");
const { authorize } = require("../middlewares/auth");

router.get("/", reparosController.list);
router.get("/:id", reparosController.getById);
router.post("/", authorize("admin", "gerente"), reparosController.create);
router.put("/:id", authorize("admin", "gerente"), reparosController.update);
router.delete("/:id", authorize("admin"), reparosController.remove);

module.exports = router;
