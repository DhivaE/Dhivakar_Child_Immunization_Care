const express = require("express");
const app = express();
const bodyparser = require("body-parser");

//Middleware to parse the json, url
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

var cors = require('cors');
app.use(cors());

const doctors = [];

/**
 * API : creating a New doctor
 * URI: /doctors
 * Method: POST
 */
// req- request object,  res-response object, use req.body , req.params to read
app.post("/doctors", (req, res) => {
  const doctor = req.body;
  if (doctor.name || doctor.available_slot || doctor.hospital) {
    doctors.push({
      doctor_id: `doctor${doctors.length + 1}`,
      ...doctor,
    });
    res.status(201).json({
      message: "doctor created successfully"
    });
  } else {
    res.status(401).json({
      message: "Invalid doctor creation"
    });
  }
});

/**
 * API : Retreive all doctors
 * URI: /doctors
 * Method: GET
 */

app.get("/doctors", (req, res) => {
  res.status(200).send(doctors);
});

/**
 * API : Retreive all doctor by name
 * URI: /doctorByName/:id
 * Method: GET By Id
 */

app.get("/doctorByName/:id", (req, res) => {
  const reqName = req.params.id;
  const doctor = doctors.find((x)=> x.name == reqName);
  if(doctor != null || undefined)
    return res.status(200).send(doctors.filter((x)=> x.name == reqName));
  res.status(404).json({ message: "Invalid doctor name" });
});

/**
 * API : Retreive all doctor by id
 * URI: /doctors/:id
 * Method: GET By Id
 */

app.get("/doctors/:id", (req, res) => {
  const reqId = req.params.id;
  const doctor = doctors.find((x)=> x.doctor_id == reqId);
  if(doctor != null || undefined)
    return res.status(200).send(doctors.find((x)=> x.doctor_id == reqId));
  res.status(404).json({ message: "Invalid doctor id" });
});


/**
 * API : Retreive all doctor by available_slot
 * URI: /doctors/:id
 * Method: GET By Id
 */

app.get("/doctors-availability/:id", (req, res) => {
  const slot = req.params.id;
  const doctor = doctors.filter((x)=> x.available_slot == slot);
  if(doctor != null || undefined){
    const filterdList = doctors.filter((x)=> x.available_slot == slot);
    return res.status(200).send(filterdList);
  }
  res.status(404).json({ message: "Invalid available_slot" });
});


/**
 * API : Update an doctor
 * URI: /doctors/:id
 * Method: PATCH
 */
app.patch("/doctors/:id", (req, res) => {
  const doctor_id = req.params.id;
  const doctor_details = req.body;
  console.log(req.body);
  for (let doctor of doctors) {
    if (doctor.doctor_id == doctor_id) {
      if (doctor_details.name != null || undefined)
        doctor.name = doctor_details.name;
      if (doctor_details.available_slot != null || undefined)
        doctor.available_slot = doctor_details.available_slot;
      if (doctor_details.hospital != null || undefined)
        doctor.hospital = doctor_details.hospital;
      
      return res
        .status(200)
        .json({ message: "Updated Succesfully", data: doctor });
    }
  }

  res.status(404).json({ message: "Invalid doctor Id" });
});

/**
 * API : Deletes an doctor
 * URI: /doctors/:id
 * Method: DELETE
 */
app.delete("/doctors/:id", (req, res) => {
  const doctor_id = req.params.id;

  for (let doctor of doctors) {
    if (doctor.doctor_id == doctor_id) {
      doctors.splice(doctors.indexOf(doctor), 1);

      return res.status(200).json({
        message: "Deleted Successfully"
      });
    }
  }
  res.status(404).json({ message: "Invalid doctor Id" });
});

module.exports = app;