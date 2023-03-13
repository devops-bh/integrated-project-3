var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const isSignedIn = require("./middleware").isSignedIn

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session.signed_in == true) {
    res.render('index', { title: 'Litter Map', signed_in: true});
    return; 
  }
  res.render('index', { title: 'Litter Map', signed_in: false});
});

// For register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'register' })
}) 

// for logged in user Main Menu page
router.get('/loggedinusermainmenu', (req, res) => {
  res.render('loggedinusermainmenu', { title: 'loggedinusermainmenu' })
}) 


// For report Litter Menu Homepage
router.get('/reportlittermenuhomepage', (req, res) => {
  res.render('reportlittermenuhomepage', { title: 'reportlittermenuhomepage' })
}) 

// for pin to report page
router.get('/pinToReportPage', (req, res) => {
  res.render('pinToReportPage', { title: 'pinToReportPage' })
}) 

// for blog page 
router.get('/Blog', (req, res) => {
  res.render('Blog', { title: 'Blog' })
}) 

// for user profile page
router.get('/userprofile', (req, res) => {
  res.render('userprofile', { title: 'userprofile' })
}) 

// for personal score page
router.get('/personalscore', (req, res) => {
  res.render('personalscore', { title: 'personalscore' })
}) 

// for monthly score page
router.get('/monthlyscore', (req, res) => {
  res.render('monthlyscore', { title: 'monthlyscore' })
}) 



// perhaps this belongs in routes/users.js 
router.get('/sign-in', (req, res) => {
  res.render('sign-in', { title: 'Sign in' })
}) 

router.post('/sign-in', isSignedIn, (req, res) => {
  const { email, password } = req.body
  console.log(`Email: ${email}, password: ${password}`)
  if (email == "" || password == "") {
    res.redirect('/') // todo: implement warning using the connect-flash package (I think res.render should be used to get rid of the resubmit form message)
    return;
  }
  bcrypt.hash('lecturer', 1, (err, hashedPassword) => {
    if (err) { throw (err); }
    bcrypt.compare('lecturer', hashedPassword, (err, result) => {
        if (err) { throw (err); }
        req.session.signed_in = true 
        console.log("user has just signed in: ", result) 
        res.render('index', {title: 'signed in as ross', signed_in: req.session.signed_in}) 
    });
  });
})

router.get('/sign-off', isSignedIn, (req, res) => {
  req.session.signed_in = false
  req.session.destroy()
  res.redirect('/')
  console.log("a user signed off")
})


module.exports = router;
