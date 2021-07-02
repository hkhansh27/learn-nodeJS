const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const userRoute = require("./routes/user");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(userRoute.routes);

app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Error page" });
});

app.listen(3333);
