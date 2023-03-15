var express = require('express');
var router = express.Router();
const isSignedIn = require("./middleware").isSignedIn
const EventEmitter = require("events")
class MarkerEmitter extends EventEmitter {} 
const markerEmitter = new MarkerEmitter() 


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let markers = []; // [refactor] perhaps call these litter_event or litter_location or something 

// maybe rename this route to something better e.g. add-litter-location 
router.post('/add-marker', isSignedIn, async (req, res) => {
  const { userId, lat, lng } = req.body
  const newMarker = {userId, lat: req.body.lat, lng: req.body.lng}  
  markers.push(newMarker);
  markerEmitter.emit("marker", newMarker) 
  console.log(` User: ${newMarker.userId} Lat: ${newMarker.lat}, Lng: ${newMarker.lng}`)
})  

router.get("/events", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
    });
  markerEmitter.on("marker", (marker) => { // [refactor] there may be a better way of getting the markers 
    res.write(`data: ${JSON.stringify({marker})}`);
    res.write("\n\n");
    res.end();
  })
})

// [todo] cleanup e.g. handle connection close (on sign off?)
router.get("/disconnect-map", (req, res) => {

})

module.exports = router;