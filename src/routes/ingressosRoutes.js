const router = require("express").Router();

const ingressosController = require("../controllers/ingressosController");
const { authorize } = require("../middlewares/auth");

router.get("/", ingressosController.list);
router.get("/:id", ingressosController.getById);
router.post("/", authorize("admin", "gerente"), ingressosController.create);
router.put("/:id", authorize("admin", "gerente"), ingressosController.update);
router.delete("/:id", authorize("admin"), ingressosController.remove);

module.exports = router;
