const Client = require("../models/client");

//Root path
const rPath = require("../variables/root-path.json").path;

//Get api provided in route
//Async function
exports.getClientsApi = async (req,res) =>{
    //Await clients found
    const clients = await Client.findAll();

    if(clients.length > 0){
        return res.send({response: clients});    
    }
    else{
        return res.status(400).send({response: "No clients in database"});
    }
}

//get allclients.html
exports.getClientsPage = (req, res) =>{
    return res.sendFile("/public/html/allclients.html", {root: rPath});
}

//Post add clients
//Async function
exports.postAddClients = async (req, res) =>{
    const name = req.body.name;
    const cvr = req.body.cvr;
    const email = req.body.email;
    const phone = req.body.phone;
    const contact = req.body.contact;

    //If attributes is provided by user
    if(name && cvr && email && phone && contact){

        try{
            //Await client found
            const clientExists = await Client.findOne({where: {cvr: cvr}});
            if(clientExists){
                return res.status(400).send({response: "Client already in database"});
            }
            else{
                //Add new client to database
                const newClient = new Client({
                    name: name,
                    cvr: cvr,
                    email: email,
                    phone: phone,
                    contact: contact
                })
                newClient.save();
                return res.redirect("/kunder");
            }
        }
        catch(error){
            console.log(error);
            return res.redirect("/kunder");
        }
    }
    else{
        res.status(400).send({response: "Please enter all info"});
    }
}

//Get chosen client from id 
//Async function
exports.getEditClient = async (req, res) =>{
    const id = req.params.id;
    //Await client found
    const client = await Client.findOne({where:{id: id}});

    if(client != null){
        return res.send({response: client});
    }
    else{
        return res.status(400).send({response: "Can't find that client in db"});
    }
}

//Put client
//Async function
exports.putEditClient = async (req, res) =>{
    const name = req.body.name;
    const cvr = req.body.cvr;
    const email = req.body.email;
    const phone = req.body.phone;
    const contact = req.body.contact;
    const id = req.body.id;

    if(name && cvr && email && phone && contact && id){

        try{
            const clientExists = await Client.findOne({where: {id: id}});

            //Update client if exists
            if(clientExists){
                clientExists.update({
                    name: name,
                    cvr: cvr,
                    email: email,
                    phone : phone,
                    contact : contact
                },{where: {id: id}})
                .then(function(updatedClient) {
                    //Send back json to api for success
                    res.json(updatedClient);
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
        res.status(400).send({response: "Every input field should be filled"});
    }
}

//Delete client
exports.deleteClients = (req, res) =>{
    const id = req.params.id;
    Client.destroy({where: {id: id}}).then(deletedClient =>{
        res.json(deletedClient);
    });
}


