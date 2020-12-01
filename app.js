const path = require("path");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");

const DB = require("./models/database");
const Project = require("./models/project");
const Client = require("./models/client");

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
const projectRoute = require("./routes/project");
app.use(projectRoute);

//Database associations
Client.hasMany(Project);
Project.belongsTo(Client);

//Get the app and database up and running
DB.sync();
app.listen(process.env.PORT || 4000);