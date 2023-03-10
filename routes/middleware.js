// may instead call this helpers.js 

function isSignedIn(req, res, next) {
  if (req.session.signed_in == false) {
    res.redirect('/sign-in')
  } 
  next();
}
module.exports.isSignedIn = isSignedIn