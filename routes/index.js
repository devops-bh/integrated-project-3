var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// perhaps this belongs in routes/users.js 
router.get('/sign-in', (req, res) => {
  console.log("signin")
  res.render('sign-in', { title: 'Sign in' })
}) 
router.post('/sign-in', (req, res,) => {
  const { email, password } = req.body
  if (email == "" || password == "") {
    res.redirect('https://google.com/') // todo: implement warning using the connect-flash package 
  }
  if (password == "lecturer") {
    res.redirect('/') 
    // todo: update session variable 
  }
})

module.exports = router;
