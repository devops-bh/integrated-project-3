var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.signed_in == true) {
    res.render('index', { title: 'Litter Map', signed_in: true});
    return; 
  }
  res.render('index', { title: 'Litter Map', signed_in: false });
});



// perhaps this belongs in routes/users.js 
router.get('/sign-in', (req, res) => {
  res.render('sign-in', { title: 'Sign in' })
}) 

function isSignedIn(req, res, next) {
  console.log("checking user is signed in")
  if (req.session.signed_in == false) {
    res.redirect('/sign-in')
  } 
  if (req.session.signed_in) {
    res.redirect('/', {title: 'Litter Map', signed_in: false})
  }
  next();
}

router.post('/sign-in', isSignedIn, (req, res) => {
  const { email, password } = req.body
  console.log(`Email: ${email}, password: ${password}`)
  if (email == "" || password == "") {
    res.redirect('/', {signed_in: false, title: 'Litter Map'}) // todo: implement warning using the connect-flash package 
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

module.exports = router;
