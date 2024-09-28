const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accRouter = require("./accounts");
router.use("/user", userRouter);
router.use("/account", accRouter);

module.exports = router;
