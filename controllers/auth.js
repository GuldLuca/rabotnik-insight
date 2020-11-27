const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const Employee = require('../models/employee');

const saltRounds = 12;

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY
  })
);
console.log({ key: process.env(SENDGRID_API_KEY) });
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

exports.postSignup = async (req, res) =>{
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
        const employeeExists = await Employee.findOne({where: {email: email}});
        console.log(email);
        console.log("employeeExists ", employeeExists);
        if(employeeExists){
          return res.status(400).send({response: "Employee already registered"});
        }
        else{
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const newEmployee = new Employee({
            email: email,
            password: hashedPassword  
          });
          newEmployee.save();
          transport.sendMail({
            from: "info@rabotnik.coop",
            to: email,
            subject: "Sign-up to Rabotnik Insight",
            text: "Hi, you just signed up to Rabotnik Insight. You can now use the system by logging in."
          }, (error, info) =>{
            console.log(error);
            console.log(info.envelope);
            console.log(info.messageId);
          });
          return res.redirect("/");
        }
      }
      catch(error){
        console.log(error);
        return res.redirect("/");
      }
    }
  }
  else if(password && confirmedPassword && !passwordMatch){
    return res.status(400).send({response:"Password dosen't match"});
  }
  else{
    return res.status(400).send({response: "Please enter something"});
  }
};

