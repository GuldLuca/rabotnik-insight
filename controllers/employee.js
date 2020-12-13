const Employee = require("../models/employee");
const DB = require("../models/database");

const rootPath = "/home/luca/Skole/datamatiker/rabotnik-insight";

exports.getEmployeePage = (req, res) =>{
    console.log(req.session);
    req.session.save();
    return res.sendFile("/public/html/profile.html", {root: rootPath});
}

exports.getEmployeeApi = (req, res) =>{
    console.log("inside getEMployeapi");
    console.log("This is req.session: ", req.session);
    console.log("req.session.employee in controller ", req.session.employee);
    req.session.save();

    if(req.session && req.session.employee){
        console.log("inside if in controller");
        Employee.findOne({where: {email: req.session.employee.email}, function (error, employee) {
            if(!employee){
                req.session.reset();
                console.log("Here?");
                return res.sendFile("/public/html/index.html", {root: rootPath});
            }
            else{
                res.locals.employee = employee;
                console.log("this is res.locals.employee", res.locals.employee);
                return res.send({response: employee});
            }
        }});
    }
    else{
        return res.sendFile("/public/html/index.html", {root: rootPath});
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

