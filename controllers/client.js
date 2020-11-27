const Client = require("../models/client");
const DB = require("../models/database");

exports.getClientsApi = async (req,res) =>{
    const clients = await Client.findAll();

    if(clients.length > 0){
        
        return res.send({reponse: clients});    
    }
    else{
        return res.status(400).send({response: "No clients in database"});
    }
}

exports.getClientsPage = (req, res) =>{
    return res.sendFile("/public/html/allclients.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
}

exports.postAddClients = async (req, res) =>{
    const name = req.body.name;
    const cvr = req.body.cvr;
    const email = req.body.email;
    const phone = req.body.phone;
    const contact = req.body.contact;

    console.log("inside postClients");
    console.log(name, cvr, email, phone, contact);
    if(name && cvr && email && phone && contact){

        try{
            const clientExists = await Client.findOne({where: {cvr: cvr}});
            console.log("inside try");
            if(clientExists){
                console.log("inside if");
                return res.status(400).send({repsonse: "Client already in database"});
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

exports.postDeleteClients = (req, res) =>{
    
}


