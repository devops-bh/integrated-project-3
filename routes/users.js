var express = require('express');
var router = express.Router();
const sse = require('server-sent-events');
const isSignedIn = require("./middleware").isSignedIn
const EventEmitter = require("events")
class MarkerEmitter extends EventEmitter {} // pretty sure I can just use an instance of the EventsEmitter 
const markerEmitter = new MarkerEmitter() 
let unseenOrders = [] // can be stored in a singleton I guess? or something better (though I'm not trying to avoid using global scope)


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

// todo: handle connection close (on sign out?)
/* 
const handleSSE = (req, res) =>{
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('id: ' + Math.random() + '\n');
  res.write("data: " + JSON.stringify({name: 'test'}) + '\n\n');
  res.flush()
}
*/
/* 
let prevMarkers = []
router.get("/events", (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('id: ' + Math.random() + '\n');
  res.write("data: " + JSON.stringify({name: 'test'+Math.random()}) + '\n\n');
//  if (prevMarkers == markers) {
    res.end()
//  }
  prevMarkers = markers
  //res.flush()
  //res.flushHeaders();
})

/*
router.get('/events', (req, res)=>{
    res.status(200).set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
    });
    res.write(`data:${JSON.stringify(markers)} ${Math.random()}\n\n`);
  });
  */

router.get("/disconnect-map", (req, res) => {
  res.end()
})
/* 
router.get('/events', (req, res) => {

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    res.write(`data: ${JSON.stringify({num: Math.random()})}\n\n`); 

    /* 
    // If client closes connection, stop sending events
    res.on('close', () => {
        console.log('client dropped me');
        clearInterval(interValID);
        res.end();
    });
    *
});
*/
module.exports = router;
