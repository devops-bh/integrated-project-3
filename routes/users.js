const fs = require("fs")
const path = require("path")
var express = require('express');
var router = express.Router();
const isSignedIn = require("./middleware").isSignedIn
const uuid = require("uuid").v4
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
  // [refactor] could probably refactor this so that properties can be added to the frontend without the need to touch the backend 
  const { userId, lat, lng, title, date } = req.body
  const newMarker = {user_id: userId, lat: req.body.lat, lng: req.body.lng, marker_id: uuid(), title: title, date: date}  
    fs.readFile(path.join(__dirname, "./database.json"), 'utf8', (err, data) => {
        if (err) console.log(err)
        const parsedData = JSON.parse(data)
        parsedData.litter_locations.push(newMarker) 
        const newData = parsedData
        fs.writeFile(path.join(__dirname, "./database.json"), JSON.stringify(newData), err => {
          if (err) {
            console.error(err);
            // [todo] res.render or redirect with "something went wrong" message 
            res.send(err)
          } else {
            console.log(` User: ${newMarker.userId} Lat: ${newMarker.lat}, Lng: ${newMarker.lng} 
            date: ${newMarker.date} 
            :)`)
            markerEmitter.emit("marker", newMarker) 
          }
        });
      })
})  



router.get("/events", (req, res) => {
  /* 
  here I might just read from file based on user id which will likely be a session variable & constantly read 
  */
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });
  markerEmitter.on("marker", (marker) => { // [refactor] there may be a better way of getting the markers 
    res.write(`data: ${JSON.stringify({marker})}`);
    res.write("\n\n");
    console.log("user tried to add a marker ", marker)
    res.end();
  })
})

// [todo] cleanup e.g. handle connection close (on sign off?)
router.get("/disconnect-map", (req, res) => {

})

router.post("/volunteer", isSignedIn, (req, res) => {
  console.log("We got a new volunteer")
  fs.readFile(path.join(__dirname, "./database.json"), 'utf8', (err, data) => {
    if (err) console.log(err)
    const parsedData = JSON.parse(data)
    const newVolunteer = { user_id: req.body.user_id, marker_id: req.body.marker_id, volunteer_id: uuid() }
    parsedData.volunteers.push(newVolunteer) 
    const newData = parsedData
    fs.writeFile(path.join(__dirname, "./database.json"), JSON.stringify(newData), err => {
      if (err) {
        console.error(err);
        // [todo] res.render or redirect with "something went wrong" message 
        res.send(err)
      } else {
            console.log(req.body.marker_id, req.body.user_id )
            res.send({msg: "success"})
          }
        });
      })
})

router.post("/markEventAsClean", isSignedIn, (req, res) => {
  console.log(req.body) 
  fs.readFile(path.join(__dirname, "./database.json"), 'utf8', (err, data) => {
    if (err) console.log(err)
        let parsedData = JSON.parse(data)
    parsedData.litter_locations.map((litter_location, i) => {
      if (litter_location.marker_id == req.body.marker_id) {
        parsedData.litter_locations.splice(i, 1);
        return;
      }
    })

    parsedData.volunteers.map((volunteer, i) => {
      if (volunteer.marker_id == req.body.marker_id) {
        parsedData.users.map(user => {
          if (user.user_id == volunteer.user_id) {
            user.score += 100
            console.log("USER SCORE: ", user.score) // may be logged 3 times but doubt this matters 
            parsedData.volunteers.splice(i, 1); 
          }
        })
      }
    })
    const newData = parsedData
      fs.writeFile(path.join(__dirname, "./database.json"), JSON.stringify(newData), err => {
        if (err) {
          console.error(err);
          // [todo] res.render or redirect with "something went wrong" message 
          res.send(err)
        } else {
          res.send({msg: "success"})
        }
        })
})})

// for user profile page
router.get('/userprofile', isSignedIn, (req, res) => {
  res.render('userprofile', { title: 'userprofile', signed_in: true, score: req.session.score })
}) 


module.exports = router;