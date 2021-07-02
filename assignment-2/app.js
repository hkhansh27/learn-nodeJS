const express = require("express");

const app = express();

app.use("/user", (req, res, next) => {
  res.send('<h1>User"s page</h1>');
});

app.use("/", (req, res, next) => {
  res.send("<h1>Home page</h1>");
});

app.listen(3333);
