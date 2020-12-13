const path = require("path");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");

//Database model instances
const DB = require("./models/database");
const Project = require("./models/project");
const Client = require("./models/client");
const Task = require("./models/task");
const Employee = require("./models/employee");

//Bodyparser configurations
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static route
app.use(express.static(path.join(__dirname, "public")));

//Session setup
app.use(session({
    secret: "thisistopsecret",
    cookie: {maxAge: 8*60*60*100},
    resave: true,
    saveUninitialized: true
}));

//Routes
const authRoute = require("./routes/auth");
app.use(authRoute);
const clientRoute = require("./routes/clients");
app.use(clientRoute);
const projectRoute = require("./routes/project");
app.use(projectRoute);
const taskRoute = require("./routes/task");
app.use(taskRoute);
const employeeRoute = require("./routes/employee");
app.use(employeeRoute);
const timeRoute = require("./routes/time");
app.use(timeRoute);

//Database associations
Client.hasMany(Project);
Project.belongsTo(Client);
Project.hasMany(Task);
Task.belongsTo(Project);
Employee.belongsToMany(Task, {as: "tasks", through: "EmployeeTasks"});
Task.belongsToMany(Employee, {as: "employees", through: "EmployeeTasks"});

//Get the app and database up and running
DB.sync();
app.listen(process.env.PORT || 3000);

/*Promise.all([Employee.create({email: "nomail@localhost.local", password: "1234"}), Task.create({})]).then(([e, t]) => e.addTask(t));

Promise.all([Employee.findOne({
    where: { id: 7 },
    include:[{
        model: Task,
        as: "tasks",
        required: false,
        attributes: ["id", "titel"],
    }]
})]).then(([x]) => console.log(x.tasks));*/