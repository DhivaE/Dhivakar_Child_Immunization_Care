const express = require("express");
const axios = require('axios');
const app = express();
const bodyparser = require("body-parser");
const router = express.Router();

//Middleware to parse the json, url
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//local variable! Will be replaced with MongoDB



/**
 * API : creating a New doctor by calling doctor service via ApiGateway
 * URI: /doctors
 * Method: POST
 */
// req- request object,  res-response object, use req.body , req.params to read
app.post("/doctors", (req, res) => {
  const postData =  {
    name: req.body.name,
    available_slot : req.body.available_slot,
    hospital : "ApolloPharmacy"
}

axios.post('http://localhost:3002/doctors', postData).then((response => {
    res.send(response.data);
  })).catch(error => {
    console.log(error);
    res.status(500).send('An error occured');
  })

});

/**
 * API : Retreive all doctors by calling doctor service via ApiGateway
 * URI: /orders
 * Method: GET
 */
app.get("/doctors", (req, res) => {
  axios.get('http://localhost:3002/doctors').then((response => {
    res.send(response.data);
  })).catch(error => {
    console.log(error);
  })
});

/**
 * API : creating a New doctor by calling doctor service via ApiGateway
 * URI: /doctors
 * Method: POST
 */
// req- request object,  res-response object, use req.body , req.params to read
app.post("/doctor-sign-off", (req, res) => {

  axios.get(`http://localhost:3002/doctors/${req.body.doctor_id}`).then((response => {
    const patchData =  {
      vaccinated: true,
      vaccinated_doctor_id: req.body.doctor_id,
      vaccinated_doctor_name: response.data.name,
  };
  console.log(patchData)
    axios.patch(`http://localhost:3001/children/${req.body.child_id}`, patchData).then((response => {
      res.send(response.data);
    })).catch(error => {
      console.log(error);
      res.status(500).send('An error occured');
    })
  })).catch(error => {
    console.log(error);
    res.status(500).send('An error occured');
  })

});



module.exports = app;