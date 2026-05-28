const router = require("express").Router();

const eventosController = require("../controllers/eventosController");
const { authorize } = require("../middlewares/auth");

router.get("/", eventosController.list);
router.get("/:id", eventosController.getById);
router.post("/", authorize("admin", "gerente"), eventosController.create);
router.put("/:id", authorize("admin", "gerente"), eventosController.update);
router.delete("/:id", authorize("admin"), eventosController.remove);

module.exports = router;
