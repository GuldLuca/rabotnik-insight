const express = require("express");

const clientController = require("../controllers/client");

const router = express.Router();

router.get("/api/kunder", clientController.getClientsApi);

router.get("/kunder", clientController.getClientsPage);

router.post("/add-client", clientController.postAddClients);

router.delete("/delete-client/:id", clientController.deleteClients);

router.get("/api/kunder/edit/:id", clientController.getEditClient);

router.put("/edit-client", clientController.putEditClient);

module.exports = router;