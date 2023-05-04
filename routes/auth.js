const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
var kafka = require('../kafka/client');

//REGISTER
router.post("/register", async (req, res) => {
  console.log('reg');
  kafka.make_request('user-register', req.body, function(err, results){
    console.log('inside after kafka message')
    console.log(results);
    console.log("error is" + err)
      if (!results) {res.status(400).send("email id already exists")}
     else{
            res.status(200).send("user registered successfully");
        }
})
});

//LOGIN
router.post("/login", async (req, res) => {
  console.log("login");
  kafka.make_request('user-login', req.body, function(err, results){
    console.log('inside after kafka message')
    console.log(results);
    console.log("error is" + err)
      if (!results) {res.status(400).send("bad request")}
     else{
          re=new String(results)
          if(re=="Error" || re=="Incorrect Email ID" || re=="Incorrect password"){
            res.status(400).send(re);
          }else{
            res.status(200).json(results);
          }
        }
})
});

module.exports = router;
