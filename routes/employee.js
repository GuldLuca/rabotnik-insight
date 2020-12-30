const express = require("express");

const employeeController = require("../controllers/employee");

const router = express.Router();


//Routes and what to happen when hit
router.get("/api/employee", employeeController.getEmployeeApi);

router.get("/employee", employeeController.getEmployeePage);

router.put("/edit-info", employeeController.putEditEmployeeInfo);

module.exports = router;