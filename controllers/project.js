const Client = require("../models/client");
const Project = require("../models/project");
const DB = require("../models/database");

exports.getProjectPage = (req, res) =>{
    return res.sendFile("/public/html/all-projects.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
}

exports.getProjectApi = async (req,res) =>{
    const projects = await Project.findAll();
    const clients = await Client.findAll();

    if(projects.length > 0){

        if(projects.length > 0 && clients.length >0){
            return res.send({projects, clients});
        }
        else{
            return res.send({projects});    
        }
    }
    else{
        return res.status(400).send({response: "No projects in database"});
    }
}

exports.postAddProject = async (req, res) =>{
    const titel = req.body.titel;
    const description = req.body.description;
    const price = req.body.price;
    const deadline = req.body.deadline;

    const client = req.body.client;

    if(titel && description && price && deadline && client){

        try{
            const projectExists = await Project.findOne({where: {titel: titel}});
            if(projectExists){
                return res.status(400).send({repsonse: "Project already in database"});
            }
            else{
                console.log(client);
                const clientFromDB = await Client.findOne({where: {"name": client}});
                console.log(clientFromDB);
                const project = Project.create({
                    titel: titel,
                    description: description,
                    price: price,
                    deadline: deadline
                }).then( async project =>{
                    await project.setClient(clientFromDB);
                })
                return res.redirect("/opgaver");
            }
        }
        catch(error){
            console.log(error);
            return res.redirect("/opgaver");
        }
    }
    else{
        res.status(400).send({response: "Please enter all info"});
    }
}