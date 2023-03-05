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
    res.render('sign-in', {message: 'email/password missing'})
    return
  }
  console.log("rendered")
})

module.exports = router;
