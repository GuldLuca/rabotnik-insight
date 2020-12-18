const bcrypt = require("bcryptjs");

const Employee = require("../models/employee");

const saltRounds = 12;

//root path
const rPath = require("../variables/root-path.json").path;

//Get index.html
exports.getIndex = (req,res) =>{
  return res.sendFile("/public/html/index.html", {root: rPath});
}

//Get frontpage.html
exports.getFront = (req, res) =>{
  return res.sendFile("/public/html/frontpage.html", {root: rPath});
}

//Post login, if success redirect to frontpage.html
exports.postLogin = (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;

  //Sequelize query to find matching employee
  Employee.findOne({where:{email: email}})
  .then(employee => {

    if(!employee){
      console.log("Employee dosen't exist");
      return res.sendFile("/public/html/index.html", {root: rPath});
    }
    // using bcrypt to decrypt encrypted password from database and matching on input password
    bcrypt
    .compare(password, employee.password)
    .then(match =>{
      if(match){
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

//Post signup, if success nem row added to employee table in database
//Async function
exports.postSignup = async (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.passwordrepeat;

  //Check if the two provided passwords match
  const passwordMatch = password === confirmedPassword;

  if(email && password && passwordMatch){
    //Password requirements for security
    if(password.length < 8){
      return res.status(400).send({response: "Password should be longer than 8 characters"});
    }
    else{
      try{
        //Await / pause until employee is found from database
        const employeeExists = await Employee.findOne({where: {email: email}});
        if(employeeExists){
          return res.status(400).send({response: "Employee already registered"});
        }
        else{
          //Encrypting password 
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
  //Kill session if logout
  req.session.destroy(error =>{
    console.log(error);
    return res.sendFile("/public/html/index.html", {root: rPath});
  })
}

