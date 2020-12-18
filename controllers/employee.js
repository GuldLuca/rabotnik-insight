const Employee = require("../models/employee");
const Task = require("../models/task");
const Project = require("../models/project");
const Client = require("../models/client");

//Root path
const rPath = require("../variables/root-path.json").path;

//Get profile.html
exports.getEmployeePage = (req, res) =>{
    return res.sendFile("/public/html/profile.html", {root: rPath});
}

//Get api for employee
//Async function
exports.getEmployeeApi = async (req, res) =>{
    const employee = await Employee.findOne({where: {email: req.session.employee.email}});
    //Get rows from join table
    const employeeTasks = await Employee.findAll({
        include:[{
            model: Task,
            as: "tasks",
            required: false
        }]
    });
    const projects = await Project.findAll();
    const clients = await Client.findAll();

    //If session persists and data is accessable send to api
    if(req.session.employee && employee && employeeTasks && projects && clients){
        return res.send({employee, employeeTasks, projects, clients});
    }
    else if(!employeeTasks){
        return res.send({employee});
    }
    else{
        return res.status(400).send({response: "No tasks in database"});
    }
}

//Put employee info
//Async function
exports.putEditEmployeeInfo = async(req, res) =>{
    const currentEmail = req.body.currentEmail;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    if(currentEmail && firstName && lastName && email){

        try{
            const employeeExists = await Employee.findOne({where: {email: currentEmail}});
            if(employeeExists){
                employeeExists.update({
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                },{where: {email: currentEmail}})
                .then(function(updatedEmployee) {
                    //Send back updated employee to api for success
                    res.json(updatedEmployee);
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

