const express = require("express");

const router = express.Router();

const { data } = require("./admin");

const isPositive = () =>
  router.get("/", (req, res) => {
    res.render("user", { pageTitle: "User page", data: data });
  });

exports.routes = router;
