const router = require("express").Router();

const instrumentosController = require("../controllers/instrumentosController");
const { authorize } = require("../middlewares/auth");

router.get("/", instrumentosController.list);
router.get("/:id", instrumentosController.getById);
router.get("/:id/membros", instrumentosController.listMembros);
router.post("/", authorize("admin", "gerente"), instrumentosController.create);
router.post("/:id/membros", authorize("admin", "gerente"), instrumentosController.addMembro);
router.put("/:id", authorize("admin", "gerente"), instrumentosController.update);
router.delete("/:id/membros/:membroId", authorize("admin", "gerente"), instrumentosController.removeMembro);
router.delete("/:id", authorize("admin"), instrumentosController.remove);

module.exports = router;
