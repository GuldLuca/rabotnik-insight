const path = require("path");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require("session");

const DB = require("./models/database");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

const authRoute = require("./routes/auth");
app.use(authRoute);


DB.sync();
app.listen(process.env.PORT || 4000);