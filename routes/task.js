const express = require('express');

const taskController = require('../controllers/task');

const router = express.Router();

router.get("/api/tasks", taskController.getTaskApi);

router.get("/tasks", taskController.getTaskPage);

router.post("/add-task", taskController.postAddTask);

router.delete("/delete-task/:id", taskController.deleteTask);

router.get("/api/tasks/edit/:id", taskController.getEditTask);

router.put("/edit-task", taskController.putEditTask);

module.exports = router;