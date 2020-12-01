const express = require('express');

const projectController = require('../controllers/project');

const router = express.Router();

router.get("/api/opgaver", projectController.getProjectApi);

router.get("/opgaver", projectController.getProjectPage);

router.post("/add-project", projectController.postAddProject);

//router.post("/delete-project", projectController.postDeleteClients);

module.exports = router;