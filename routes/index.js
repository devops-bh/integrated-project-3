var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const isSignedIn = require("./middleware").isSignedIn
const mysql = require('mysql2');

// create the connection to database
// also see www.npmjs.com/package/mysql2#user-content-using-connection-pool
require('dotenv').config()
const indexConnection = mysql.createConnection({ // stupidly creating a new connection for quickness 
 host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT
});

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
  bcrypt.hash(password, 10).then(_hash =>{
    hashedPassword = _hash
    console.log(hashedPassword)
    indexConnection.execute('INSERT INTO `users` (`user_id`, `score`, `firstname`, `lastname`, `email`, `password`, `postcode`, `image_path`, `is_staff`) VALUES (DEFAULT, DEFAULT, ?, ?, ?, ?, ?, ?, ?)',
         //[email + "firstname", "Bobby", email, hashedPassword, "postcode2", "", 0],
         [email + firstname, lastname, email, hashedPassword, "Postcode1", "", 0],
        (err, results, fields) => { 
            if (err) console.log(err); 
            console.log("Registeration: ", results, fields)
            // respond to the user telling them they've been registered to our amazing web app 
            res.send("You have registered, please sign in") // [todo] res.render the sign in form 
          });
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
/* 
indexConnection.query('SELECT * FROM `users` where email="testone@testone.testone"', 
(err, results, fields) => { 
  if (err) console.log(err); 
  console.log(results)
  console.log(fields)
  //results.forEach(row => console.log(row.firstname))
});
/* 
indexConnection.execute(
  'SELECT * FROM `users` WHERE `email` = ?',
  ["testone@testone.testone"], (error, results, fields) => {
      if (error) console.log("Error: ", error); 
      console.log(results) // []
      console.log(fields) 
      // we care about grabbing the user using the email that was put into the form 
      // at the moment we are trying to get a list of users from the database 
      // I dont know if we are getting a single item list or a single item
      //results.forEach(row => console.log(row.firstname))
      /* 
      bcrypt.compare(req.body.password, hashedPassword).then(function(result) {
        console.log(hashedPassword, req.body.password)
          if (result) req.session.signed_in = true 
          console.log("user has just signed in: ", result) 
          res.render('index', {title: `signed in as ${req.session.signed_in ? 'ross ': 'anon'}`, signed_in: req.session.signed_in, /* [todo] user.user_id *}) 
      }).catch(compareErr => console.log(compareErr));
      *
    });
  */ 

// example of getting the user from the database using the email which was inputted into the sign in form 
indexConnection.execute('SELECT * FROM `users` WHERE email=?', ["testingantisqlinjection@email."], 
  (err, results, fields) => { 
    if (err) console.log(err)
    // console.log(results) // an array of one user e.g. [{user}]
    //results.forEach(result => console.log(result)) // 
    // alternatively you could do for (let i ...) { let result = results[i] }
    // since we are assuming emails are unique, you can simply do 
    const user = results[0]
    console.log("USER: ", user)
});

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
    res.redirect('/reportLitterMenuHomepage') // Redirect to reportLitter[todo] implement warning using the connect-flash package (I think res.render should be used to get rid of the resubmit form message)
    return;
  }
  /* 
  [{
    username: kjiosjsd
  }, {username: owkdasopksdop}]

  <xml>
    <result>
      <object><username>kjiosjsd</username></object>
      <object><username>kjiosjsd</username></object>
      <object><username>kjiosjsd</username></object>
      <object><username>kjiosjsd</username></object>
    </result>
  </xml>
  */

/* 
    connection.execute(
  'SELECT * FROM `users` WHERE `email` = ?',
  [email], (error, results, fields) => {
      if (err) console.log("Error: ", err); 
      console.log(fields) 
      //results.forEach(row => console.log(row.firstname))
      /* 
      bcrypt.compare(req.body.password, hashedPassword).then(function(result) {
        console.log(hashedPassword, req.body.password)
          if (result) req.session.signed_in = true 
          console.log("user has just signed in: ", result) 
          res.render('index', {title: `signed in as ${req.session.signed_in ? 'ross ': 'anon'}`, signed_in: req.session.signed_in, /* [todo] user.user_id *}) 
      }).catch(compareErr => console.log(compareErr));
      *
    });*/
})

router.get('/sign-off', isSignedIn, (req, res) => {
  req.session.signed_in = false
  req.session.destroy()
  res.redirect('/')
  console.log("a user signed off")
})


module.exports = router;
