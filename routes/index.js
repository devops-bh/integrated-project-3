var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.user_id = null
  res.render('index', { title: 'Express' });
  next() 
});

// perhaps this belongs in routes/users.js 
router.get('/sign-in', (req, res) => {
  console.log("signin")
  res.render('sign-in', { title: 'Sign in' })
}) 
function isSignedIn(req, res, next) {
  if (req.session.user_id == null) {
    res.redirect('/sign-in')
  } 
  return next();
}
router.post('/sign-in', isSignedIn, (req, res) => {
  const { email, password } = req.body
  if (email == "" || password == "") {
    res.redirect('/') // todo: implement warning using the connect-flash package 
  }
  // todo: get password & username from database 
  const hashedPassword = "lecturer"
  if (password == hashedPassword) { 
    req.session.user_id = "ross" // todo: replace this with database id 
    console.log("signed in")
    res.render('/', {title: 'signed in as ross', id: req.session.user_id}) 
  }
})

module.exports = router;
