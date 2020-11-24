const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const Employee = require('../models/employee');

const saltRounds = 12;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getIndex = (req,res) =>{
  return res.sendFile("/public/html/index.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
}

exports.getFront = (req, res) =>{
  return res.sendFile("/public/html/frontpage.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
}

exports.postLogin = (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;

  Employee.findOne({email: email})
  .then(employee => {
    if(!employee){
      console.log("Employee dosen't exist");
      return res.sendFile("/public/html/index.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
    }
    bcrypt
    .compare(password, employee.password)
    .then(match =>{
      if(match){
        req.session.isLoggedIn = true;
        req.session.employee = employee;
        return req.session.save(error =>{
          console.log(error);
          res.redirect("/frontpage");
        })
      }
      return res.sendFile("/public/html/index.html", {root: "/home/luca/Skole/afsluttende-projekt/rabotnik-insight"});
    })
    .catch(error =>{
      console.log(error);
      res.redirect("/");
    });
  })
  .catch(error => console.log(error));
}

exports.postSignup = (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.passwordrepeat;

  const passwordMatch = password === confirmedPassword;

  if(email && password && passwordMatch){
    if(password.length < 8){
      return res.status(400).send({response: "Password should be longer than 8 characters"});
    }
    else{
      try{
        const employeeExists = await Employee.findOne({email: email});

        if(employeeExists.length > 0){
          return res.status(400).send({response: "Employee already registered"});
        }
        else{
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const newEmployee = await Employee.query().insert({
            
          })
        }
      }
    }
  }

  bcrypt
    .hash(password, saltRounds)
    .then(hashedPassword =>{
      const employee = new Employee({
        email: email,
        password: hashedPassword
      });
      return employee.save();
    })
    .then(result =>{
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
}