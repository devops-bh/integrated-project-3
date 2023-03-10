var express = require('express');
var router = express.Router();
const isSignedIn = require("./middleware").isSignedIn

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// maybe rename this route to something better e.g. add-litter-location 
router.post('/add-marker', isSignedIn, (req, res) => {
  const { lat, lng } = req.body 
  console.log(`Lat: ${lat}, ${lng}`)
})


module.exports = router;
