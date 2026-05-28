const router = require("express").Router();

const membrosController = require("../controllers/membrosController");
const { authorize } = require("../middlewares/auth");

router.get("/", membrosController.list);
router.get("/:id", membrosController.getById);
router.post("/", authorize("admin", "gerente"), membrosController.create);
router.put("/:id", authorize("admin", "gerente"), membrosController.update);
router.delete("/:id", authorize("admin"), membrosController.remove);

module.exports = router;
