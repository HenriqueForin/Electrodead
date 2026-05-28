const router = require("express").Router();

const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const eventosRoutes = require("./eventosRoutes");
const ingressosRoutes = require("./ingressosRoutes");
const instrumentosRoutes = require("./instrumentosRoutes");
const membrosRoutes = require("./membrosRoutes");
const orcamentosRoutes = require("./orcamentosRoutes");
const presencasRoutes = require("./presencasRoutes");
const reparosRoutes = require("./reparosRoutes");
const { authenticate } = require("../middlewares/auth");

router.use("/auth", authRoutes);

router.use(authenticate);
router.use("/dashboard", dashboardRoutes);
router.use("/membros", membrosRoutes);
router.use("/instrumentos", instrumentosRoutes);
router.use("/reparos", reparosRoutes);
router.use("/eventos", eventosRoutes);
router.use("/ingressos", ingressosRoutes);
router.use("/orcamentos", orcamentosRoutes);
router.use("/presencas", presencasRoutes);

module.exports = router;
