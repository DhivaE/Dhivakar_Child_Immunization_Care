const express = require("express");
const app = express();
const bodyparser = require("body-parser");

//Middleware to parse the json, url
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

var cors = require('cors');
app.use(cors());

const children = []; 
 
/**
 * API : creating a New child
 * URI: /children
 * Method: POST
 */
// req- request object,  res-response object, use req.body , req.params to read
app.post("/children", (req, res) => {
  const child = req.body;
  if (child.name || child.parent_id || child.age) {
    children.push({
      child_id: `child${children.length + 1}`,
      ...child,
    });
    console.log();
    res.status(201).json({
      message: "child created successfully"
    });
  } else {
    res.status(401).json({
      message: "Invalid child creation"
    });
  }
});

/**
 * API : Retreive all children
 * URI: /children
 * Method: GET
 */

app.get("/children", (req, res) => {
  res.status(200).send(children);
});

/**
 * API : Retreive all children by Id
 * URI: /children/:id
 * Method: GET By Id
 */

app.get("/children/:id", (req, res) => {
  const child_id = req.params.id;
  const child = children.find((x)=> x.child_id == child_id);
  if(child != null || undefined)
    return res.status(200).send(children.find((x)=> x.child_id == child_id));
  res.status(404).json({ message: "Invalid child Id" });
});

/**
 * API : Retreive all children by parent_Id
 * URI: /children/:parent_id
 * Method: GET By Id
 */

app.get("/childrenByParent/:id", (req, res) => {
  const parent_id = req.params.id;
  const child = children.find((x)=> x.parent_id == parent_id);
  if(child != null || undefined)
    return res.status(200).send(children.filter((x)=> x.parent_id == parent_id));
  res.status(404).json({ message: "Invalid parent child relation Id" });
});

/**
 * API : Update an child
 * URI: /children/:id
 * Method: PATCH
 */
app.patch("/children/:id", (req, res) => {
  const child_id = req.params.id;
  const child_details = req.body;
  console.log(req.body);
  for (let child of children) {
    if (child.child_id == child_id) {

      if (child_details.name != null || undefined)
        child.name = child_details.name;

      if (child_details.age != null || undefined)
        child.age = child_details.age;

      if (child_details.parent_id != null || undefined)
        child.parent_id = child_details.parent_id;

      if (child_details.vaccinated != null || undefined)
        child.vaccinated = child_details.vaccinated;

      if (child_details.vaccinated_doctor_id != null || undefined)
        child.vaccinated_doctor_id = child_details.vaccinated_doctor_id;

      if (child_details.vaccinated_doctor_name != null || undefined)
        child.vaccinated_doctor_name = child_details.vaccinated_doctor_name;
      
      return res
        .status(200)
        .json({ message: "Updated Succesfully", data: child });
    }
  }

  res.status(404).json({ message: "Invalid child Id" });
});

/**
 * API : Deletes an child
 * URI: /children/:id
 * Method: DELETE
 */
app.delete("/children/:id", (req, res) => {
  const child_id = req.params.id;

  for (let child of children) {
    if (child.child_id == child_id) {
      children.splice(children.indexOf(child), 1);

      return res.status(200).json({
        message: "Deleted Successfully"
      });
    }
  }
  res.status(404).json({ message: "Invalid child Id" });
});

module.exports = app;