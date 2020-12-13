const express = require('express');

const employeeController = require('../controllers/employee');

const router = express.Router();

router.get("/api/employee", employeeController.getEmployeeApi);

router.get("/employee", employeeController.getEmployeePage);

router.get("/api/employee/edit/:id", employeeController.getEditEmployee);

router.put("/edit-employee", employeeController.putEditEmployee);

module.exports = router;