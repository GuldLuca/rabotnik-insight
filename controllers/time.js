const Employee = require("../models/client");
const Task = require("../models/task");
const Project = require("../models/project");
const Client = require("../models/client");

const rootPath = "/home/luca/Skole/datamatiker/rabotnik-insight";

exports.getTimePage = (req, res) =>{
    return res.sendFile("/public/html/time.html", {root: rootPath});
}

exports.getTime = async (req, res) =>{
    const tasks = await Task.findAll();
    const projects = await Project.findAll();
    const clients = await Client.findAll();
    const employees = await Employee.findAll();
    console.log("Here");

    const employeeTasks = await Employee.findAll({
        include:[{
            model: Task,
            as: "tasks",
            required: false
        }]
    });

    if(tasks.length > 0){

        console.log("And here");

        if(projects.length > 0 && clients.length >0 && employees.length>0){
            console.log("What here");

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