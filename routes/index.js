var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const isSignedIn = require("./middleware").isSignedIn
const fs = require('fs');
const path = require("path")
const uuid = require("uuid").v4

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session.signed_in == true) {
    res.render('index', { title: 'Litter Map', signed_in: true});
    return; 
  }
  res.render('index', { title: 'Litter Map', signed_in: false});
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'register', signed_in: false })
}) 

router.post('/register', async (req, res) => {
  const email = req.body.email  // get the value of the input field which has the "name" attribute from the form 
  const password = req.body.password
  bcrypt.hash(password, 10).then(hashedPassword => {
    // [refactor] maybe use async/await or promises? 
    fs.readFile(path.join(__dirname, "./database.json"), 'utf8', (err, data) => {
        if (err) console.log(err)
        const parsedData = JSON.parse(data)
        parsedData.users.push({user_id: uuid(), email, hashedPassword}) 
        const newData = parsedData
        fs.writeFile(path.join(__dirname, "./database.json"), JSON.stringify(newData), err => {
          if (err) {
            console.error(err);
            // [todo] res.render or redirect with "something went wrong" message 
            res.send(err)
          } else {
            res.redirect('sign-in')            
          }
        });
      })
  })
})

// For report Litter Menu Homepage
router.get('/reportlittermenuhomepage', (req, res) => {
  res.render('reportlittermenuhomepage', { title: 'reportlittermenuhomepage', signed_in: true })
}) 

// for pin to report page
router.get('/reportList', (req, res) => {
  res.render('reportList', { title: 'reportList', signed_in: true })
}) 

// for blog page 
router.get('/Blog', (req, res) => {
  res.render('Blog', { title: 'Blog', signed_in: true })
}) 

// for user profile page
router.get('/userprofile', (req, res) => {
  res.render('userprofile', { title: 'userprofile', signed_in: true })
}) 


// perhaps this belongs in routes/users.js 
router.get('/sign-in', (req, res) => {
  res.render('sign-in', { title: 'Sign in', signed_in: false })
}) 

let hashedPassword; 
bcrypt.hash("lecturer", 10).then(_hash =>{
  hashedPassword = _hash
  console.log(hashedPassword)
})
router.post('/sign-in', isSignedIn, (req, res) => {
  const { email, password } = req.body
  console.log(`Email: ${email}, password: ${password}`)
  if (email == "" || password == "") {
    console.log("Test Sign-in")
    res.send("You are trying to sign in")
    res.redirect('/') // Redirect to reportLitter[todo] implement warning using the connect-flash package (I think res.render should be used to get rid of the resubmit form message)
    return;
  }
})

router.get('/sign-off', isSignedIn, (req, res) => {
  req.session.signed_in = false
  req.session.destroy()
  res.redirect('/')
  console.log("a user signed off")
})


module.exports = router;
