const bcrypt = require("bcryptjs");

const Employee = require("../models/employee");

const saltRounds = 12;

const rPath = "/home/luca/Skole/afsluttende-projekt/rabotnik-insight";
const hPath = "/home/luca/Skole/datamatiker/rabotnik-insight"

exports.getIndex = (req,res) =>{
  return res.sendFile("/public/html/index.html", {root: rPath});
}

exports.getFront = (req, res) =>{
  return res.sendFile("/public/html/frontpage.html", {root: rPath});
}

exports.postLogin = (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;

  Employee.findOne({where:{email: email}})
  .then(employee => {

    if(!employee){
      console.log("Employee dosen't exist");
      return res.sendFile("/public/html/index.html", {root: rPath});
    }
    bcrypt
    .compare(password, employee.password)
    .then(match =>{
      if(match){
        req.session.isLoggedIn = true; // DO I NEED THIS?
        req.session.employee = employee;
        return req.session.save(error =>{
          console.log(error);
          res.redirect("/frontpage");
        })
      }
      else{
        console.log("Password dosen't match that in database ", match);
        return res.sendFile("/public/html/index.html", {root: rPath});
      }
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
}

exports.postLogout = (req, res) =>{
  req.session.destroy(error =>{
    console.log(error);
    req.isLoggedIn = false;
    return res.sendFile("/public/html/index.html", {root: rPath});
  })
}

