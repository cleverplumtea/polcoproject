const router = require("express").Router();

router.use("/ping", require("./ping"));

router.use("/posts", require("./posts"));

router.use((req, res, next) => {
  const err = new Error("API route not found!");
  err.status = 404;
  next(err);
});

module.exports = router;
