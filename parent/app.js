const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const jwtSecret = "test";

//Middleware to parse the json, url
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// ADD THIS
var cors = require('cors');
app.use(cors());
//local variable! Will be replaced with MongoDB
const parents = [];
let users = [];

/**
 * API : creating a New parent
 * URI: /parents
 * Method: POST
 */
// req- request object,  res-response object, use req.body , req.params to read
app.post("/parents", (req, res) => {
  const parent = req.body;
  if (parent.name || parent.email || parent.phone || parent.address) {
    parents.push({
      parent_id: `parent${parents.length + 1}`,
      ...parent,
    });
    console.log();
    res.status(201).json({
      message: "parent created successfully"
    });
  } else {
    res.status(401).json({
      message: "Invalid parent creation"
    });
  }
});

/**
 * API : Retreive all parents
 * URI: /parents
 * Method: GET
 */

app.get("/parents", (req, res) => {
  try{
  const token =  req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, jwtSecret);
  req.userData = decoded;
  res.status(200).send(parents);
  }catch(error){
    return res.status(401).json({
      message: "Auth Failed"
    })
  }

 
});

/**
 * API : Retreive all parents
 * URI: /parents
 * Method: GET By Id
 */

app.get("/parents/:id", (req, res) => {
  const parent_id = req.params.id;
  const parent = parents.find((x)=> x.parent_id == parent_id);
  if(parent != null || undefined)
    return res.status(200).send(parents.find((x)=> x.parent_id == parent_id));
  res.status(404).json({ message: "Invalid parent Id" });
});

/**
 * API : Update an parent
 * URI: /parents/:id
 * Method: PATCH
 */

app.patch("/parents/:id", (req, res) => {
  const parent_id = req.params.id;
  const parent_detail = req.body;
  for (let parent of parents) {
    if (parent.parent_id == parent_id) {
      if (parent_detail.name != null || undefined)
        parent.name = parent_detail.name;
      if (parent_detail.address != null || undefined)
        parent.address = parent_detail.address;
      if (parent_detail.phone != null || undefined)
        parent.phone = parent_detail.phone;
      if (parent_detail.email != null || undefined)
        parent.email = parent_detail.email;
      return res
        .status(200)
        .json({ message: "Updated Succesfully", data: parent });
    }
  }
  res.status(404).json({ message: "Invalid parent Id" });
});

/**
 * API : Deletes an parent
 * URI: /parents/:id
 * Method: DELETE
 */
app.delete("/parents/:id", (req, res) => {
  const parent_id = req.params.id;

  for (let parent of parents) {
    if (parent.parent_id == parent_id) {
      parents.splice(parents.indexOf(parent), 1);

      return res.status(200).json({
        message: "Deleted Successfully"
      });
    }
  }
  res.status(404).json({ message: "Invalid parent Id" });
});


app.post("/register",  async(req, res) => {
      const userDetails = req.body;
      console.log(users);
      if(users.length > 0 && users.find((x)=> x.email == userDetails.email))
      {
        return res.status(401).json({
          message: "User already exists"
        })
      }
      console.log(userDetails.password);

      bcrypt.hash(userDetails.password, 10, (err, hash)=> {
        if(err){
          return res.status(500).json({error: err});
        }
        else {
          console.log({
            user_id: `user${users.length + 1}`,
            email: userDetails.email,
            password: hash,
          });

          users.push({
            user_id: `user${users.length + 1}`,
            email: userDetails.email,
            password: hash,
          });

          console.log("success");
        }      
      })
      res.status(200).json({
        message: "Users Registered Successfully"
      });
 })

 app.get("/users", (req, res) => {
  res.status(200).send(users);
});

 

app.post("/login", (req, res) => {
  if(users.length > 0 && users.find((x)=> x.email == req.body.email) == undefined){
    return res.status(401).json({
      message: "User doesn't exist"
    })
  }

const user = users.find((x)=> x.email == req.body.email);

      bcrypt.compare(req.body.password, user.password, (err, result)=>{
        if(err){
          return res.status(401).json({message: "Auth Failed"});
        }
        if(result){
          console.log("test"+jwtSecret);
          const token = jwt.sign({
            email : user.email,
            userId: user._id,
          },
          jwtSecret,
          {
            expiresIn: "1h"
          }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token
          });
        }
        return res.status(401).json({
          message: "Auth Failed"
        })
      })
});

module.exports = app;