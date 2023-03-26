const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();

const router = require("./routes/upload.route.js");
app.use("/", cors(), router);

const server = app.listen(8080, () => {
  console.log("App listening at 8080");
});
