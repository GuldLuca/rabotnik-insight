const Client = require("../models/client");

const rPath = "/home/luca/Skole/afsluttende-projekt/rabotnik-insight";
const hPath = "/home/luca/Skole/datamatiker/rabotnik-insight"

exports.getClientsApi = async (req,res) =>{
    const clients = await Client.findAll();

    if(clients.length > 0){
        
        return res.send({response: clients});    
    }
    else{
        return res.status(400).send({response: "No clients in database"});
    }
}

exports.getClientsPage = (req, res) =>{
    return res.sendFile("/public/html/allclients.html", {root: rPath});
}

exports.postAddClients = async (req, res) =>{
    const name = req.body.name;
    const cvr = req.body.cvr;
    const email = req.body.email;
    const phone = req.body.phone;
    const contact = req.body.contact;

    if(name && cvr && email && phone && contact){

        try{
            const clientExists = await Client.findOne({where: {cvr: cvr}});
            if(clientExists){
                return res.status(400).send({response: "Client already in database"});
            }
            else{
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

exports.getEditClient = async (req, res) =>{
    const id = req.params.id;
    const client = await Client.findOne({where:{id: id}});

    if(client != null){
        return res.send({response: client});
    }
    else{
        return res.status(400).send({response: "Can't find that client in db"});
    }
}

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

            if(clientExists){
                clientExists.update({
                    name: name,
                    cvr: cvr,
                    email: email,
                    phone : phone,
                    contact : contact
                },{where: {id: id}})
                .then(function(updatedClient) {
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

exports.deleteClients = async (req, res) =>{
    const id = req.params.id;
    Client.destroy({where: {id: id}}).then(deletedClient =>{
        res.json(deletedClient);
    });
}


