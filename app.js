const path = require("path");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");

const DB = require("./models/database");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "thisistopsecret",
    resave: false,
    saveUninitialized: true
}));

const authRoute = require("./routes/auth");
app.use(authRoute);
const clientRoute = require("./routes/clients");
app.use(clientRoute);


DB.sync();
app.listen(process.env.PORT || 4000);