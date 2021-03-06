const Client = require("../models/client");
const Project = require("../models/project");

//Root path
const rPath = require("../variables/root-path.json").path;

//Get all-projects.html
exports.getProjectPage = (req, res) =>{
    return res.sendFile("/public/html/all-projects.html", {root: rPath});
}

//Get api for project
//Async function
exports.getProjectApi = async (req,res) =>{
    const projects = await Project.findAll();
    const clients = await Client.findAll();

    //Send projects and clients found
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

//Post add project
//Async function
exports.postAddProject = async (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const deadline = req.body.deadline;

    const client = req.body.client;

    if(title && description && price && deadline && client){

        try{
            const projectExists = await Project.findOne({where: {title: title}});
            if(projectExists){
                return res.status(400).send({repsonse: "Project already in database"});
            }
            else{
                const clientFromDB = await Client.findOne({where: {name: client}});
                //Create new project in database
                const project = Project.create({
                    title: title,
                    description: description,
                    price: price,
                    deadline: deadline
                }).then( async project =>{
                    //Join project and client
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

//Get specific project for edit
//Async function
exports.getEditProject = async (req, res) =>{
    const id = req.params.id;
    const project = await Project.findOne({where:{id: id}});

    if(project != null){
        return res.send({response: project});
    }
    else{
        return res.status(400).send({response: "Can't find that project in db"});
    }
}

//Put edited project
exports.putEditProject = async (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const deadline = req.body.deadline;
    const client = req.body.client;
    const id = req.body.id;

    if(title && description && price && deadline && client && id){

        try{
            const projectExists = await Project.findOne({where: {"id": id}});
            if(projectExists){
                projectExists.update({
                    title: title,
                    description: description,
                    price: price,
                    deadline : deadline,
                    client : client
                },{where: {id: id}})
                .then(function(updatedProject) {
                    res.json(updatedProject);
                  })
            }
            else{
                console.log("Something went wrong");
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

//Delete project form id
exports.postDeleteProject = (req, res) =>{
    const id = req.params.id;
    Project.destroy({where: {id: id}}).then(deletedProject =>{
        res.json(deletedProject);
    });
}