const express = require('express');

const clientController = require('../controllers/client');

const router = express.Router();

router.get("/api/kunder", clientController.getClientsApi);

router.get("/kunder", clientController.getClientsPage);

router.post("/add-client", clientController.postAddClients);

router.post("/delete-client", clientController.postDeleteClients);

module.exports = router;