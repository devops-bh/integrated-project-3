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
  // if DB becomes a bottleneck see www.npmjs.com/package/mysql2#user-content-using-promise-wrapper 
  indexConnection.query('INSERT INTO `users`(userid, score, firstname, lastname, email, password, postcode, image_path, is_staff) VALUES (?,?)',
                                            [0, 0, 'Jeff', 'Jefferson', email, password, "g23323", '', 0],  // insert data 
      (err, results, fields) => { 
          if (err) console.log(err); 
          console.log(results, fields)
          // respond to the user telling them they've been registered to our amazing web app 
        });

});


// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

// execute will internally call prepare and query
connection.execute(
  'INSERT INTO `users`(email, password) VALUES (?,?)',
  ['ross@ip3.com', 'password'],
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available

    // If you execute same statement again, it will be picked from a LRU cache
    // which will save query preparation time and give better performance
  }
);

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
    res.redirect('/') // [todo] implement warning using the connect-flash package (I think res.render should be used to get rid of the resubmit form message)
    return;
  }
    bcrypt.compare(req.body.password, hashedPassword).then(function(result) {
      console.log(hashedPassword, req.body.password)
        if (result) req.session.signed_in = true 
        console.log("user has just signed in: ", result) 
        res.render('index', {title: `signed in as ${req.session.signed_in ? 'ross ': 'anon'}`, signed_in: req.session.signed_in, /* [todo] user.user_id */}) 
    }).catch(compareErr => console.log(compareErr));
})

router.get('/sign-off', isSignedIn, (req, res) => {
  req.session.signed_in = false
  req.session.destroy()
  res.redirect('/')
  console.log("a user signed off")
})


module.exports = router;
