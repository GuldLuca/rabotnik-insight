const Client = require("../models/client");
const Project = require("../models/project");
const Task = require("../models/task");
const Employee = require("../models/employee");

//Root path
const rPath = require("../variables/root-path.json").path;

//get all-tasks.html
exports.getTaskPage = (req, res) =>{
    return res.sendFile("/public/html/all-tasks.html", {root: rPath});
}

//Get api for tasks
//Async function
exports.getTaskApi = async (req,res) =>{
    const tasks = await Task.findAll();
    const projects = await Project.findAll();
    const clients = await Client.findAll();
    const employees = await Employee.findAll();
    //get join table
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
            return res.send({tasks});    
        }
    }
    else{
        return res.status(400).send({response: "No tasks in database"});
    }
}

//Post add task
//Async function
exports.postAddTask = async (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const time = req.body.time;
    const done = req.body.done;
    const project = req.body.project;
    const employee = req.body.employee;

    const trueVal = 1;
    const falseVal = 0;

    //If done is checked
    if(title && description && time && done && project){
        try{
            const projectFromDb = await Project.findOne({where: {id: project}});
            const employeeFromDb = await Employee.findOne({where: {id : employee}});
            //Create task with done true converted to 1 for query language
            const task = Task.create({
                title: title,
                description: description,
                time: time,
                done: trueVal
            }).then( async task =>{
                //make relation to project and join employee and task
                await task.setProject(projectFromDb);
                await task.addEmployee(employeeFromDb);
            })
            return res.redirect("/tasks");
        }
        catch(error){
            console.log(error);
            return res.redirect("/tasks");
        }
    }
    //If done isn't checked
    if(!done){
        try{
            const projectFromDb = await Project.findOne({where: {id: project}});
            const employeeFromDb = await Employee.findOne({where: {id: employee}});
            //Send falseVal which is 0 to database for false value
            const task = Task.create({
                title: title,
                description: description,
                time: time,
                done: falseVal
            }).then( async task =>{
                await task.setProject(projectFromDb);
                await task.addEmployee(employeeFromDb);
            })
            return res.redirect("/tasks");
        }
        catch(error){
            console.log(error);
            return res.redirect("/tasks");
        }
    }
    else{
        res.status(400).send({response: "Please enter all info"});
    }
}

//Get specific task for edit
//Async function
exports.getEditTask = async (req, res) =>{
    const id = req.params.id;
    const task = await Task.findOne({where:{id: id}});

    if(task != null){
        return res.send({response: task});
    }
    else{
        return res.status(400).send({response: "Can't find that task in db"});
    }
}

//put edit task
//Async function
exports.putEditTask = async (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const time = req.body.time;
    const done = req.body.done;
    const project = req.body.project;
    const client = req.body.client;
    const id = req.body.id;

    const trueVal = 1;
    const falseVal = 0;

    if(title && description && time && done && project && client && id){

        try{
            const taskExists = await Task.findOne({where: {id: id}});
            if(taskExists){
                taskExists.update({
                    title: title,
                    description: description,
                    time: time,
                    done : trueVal,
                    project: project,
                    client : client
                },{where: {id: id}})
                .then(function(updatedTask) {
                    res.json(updatedTask);
                  })
            }
            else{
                console.log("Something went wrong in DB");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    else if(!done){
        try{
            const taskExists = await Task.findOne({where: {id: id}});
            if(taskExists){
                taskExists.update({
                    title: title,
                    description: description,
                    time: time,
                    done : falseVal,
                    project: project,
                    client : client
                },{where: {id: id}})
                .then(function(updatedTask) {
                    res.json(updatedTask);
                  })
            }
            else{
                console.log("Something went wrong in DB");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    else{
        res.status(400).send({response: "Please enter all info"});
    }

}

//Delete task
exports.deleteTask = (req, res) =>{
    const id = req.params.id;
    Task.destroy({where: {id: id}}).then(deletedTask =>{
        res.json(deletedTask);
    });
}
