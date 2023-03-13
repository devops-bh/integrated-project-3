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


router.get('/Register', (req, res) => {
  res.render('Register', { title: 'Register' })
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
