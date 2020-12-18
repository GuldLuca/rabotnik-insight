const Employee = require("../models/client");
const Task = require("../models/task");
const Project = require("../models/project");
const Client = require("../models/client");

//Root path
const rPath = require("../variables/root-path.json").path;

//Get time.html
exports.getTimePage = (req, res) =>{
    return res.sendFile("/public/html/time.html", {root: rPath});
}

//Get time api
//Async function
exports.getTimeApi = async (req, res) =>{
    const tasks = await Task.findAll();
    const projects = await Project.findAll();
    const clients = await Client.findAll();
    const employees = await Employee.findAll();

    //Get joined table
    const employeeTasks = await Employee.findAll({
        include:[{
            model: Task,
            as: "tasks",
            required: false
        }]
    });

    if(tasks.length > 0){

        if(projects.length > 0 && clients.length >0 && employees.length>0){

            return res.send({tasks, projects, clients, employees, employeeTasks});
        }
        else{

            return res.status(400).send({response: "No tasks, projects, clients or employees in database. Can't fetch appropriate data."});
        }
    }
    else{
        console.log("No tasks in database");
    }
}