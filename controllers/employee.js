const Employee = require("../models/employee");
const DB = require("../models/database");

const rootPathHome = "/home/luca/Skole/datamatiker/rabotnik-insight";
const rootPathRabotnik = "/home/luca/Skole/afsluttende-projekt/rabotnik-insight";

exports.getEmployeePage = (req, res) =>{
    req.session.save();
    return res.sendFile("/public/html/profile.html", {root: rootPathRabotnik});
}

exports.getEmployeeApi = async (req, res) =>{

    if(req.session && req.session.employee){
        const sessionEmail = req.session.employee.email;
        const employee = await Employee.findOne({where: {email: sessionEmail}});

        if(employee != null){
            return res.send({response: employee});
        }
        else{
            console.log("couldn't match employee from session with employee from database");
            return res.sendFile("/public/html/index.html", {root: rootPathRabotnik});
        }
    }
    else{
        console.log("Why won't it work");
        return res.sendFile("/public/html/index.html", {root: rootPathRabotnik});
    }
}

exports.getEditEmployee = async (req, res) =>{
    const id = req.params.id;
    const employee = await Employee.findOne({where:{"id": id}});

    if(employee != null){
        return res.send({response: employee});
    }
    else{
        return res.status(400).send({response: "Can't find that employee in db"});
    }
}

exports.putEditEmployee = (req, res) =>{


}

exports.getEmployeeTasks = (req, res) =>{

}

