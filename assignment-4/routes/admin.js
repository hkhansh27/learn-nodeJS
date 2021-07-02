const path = require("path");

const express = require("express");

const router = express.Router();

const nameList = [];

router.get("/", (req, res) => {
  res.render("admin", { pageTitle: "Admin" });
});

router.post("/add-user", (req, res, next) => {
  nameList.push({ name: req.body.name });
  res.redirect("/");
});

exports.routes = router;
exports.data = nameList;
