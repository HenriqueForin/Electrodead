const router = require("express").Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/resumo", dashboardController.resumo);

module.exports = router;
