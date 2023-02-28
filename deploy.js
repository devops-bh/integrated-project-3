const ngrok = require("ngrok")
require('dotenv').config()
console.log("Please ensure your ngrok authtoken is placed in the .env file within the same directory as this file")
// there's probably some trickery to have this script run npm run start as well as handle the ngrok stuff but this will do for now 
console.log("Please ensure you have ran npm run start in a different terminal session")
async function deploy() {
    await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);
    const url = await ngrok.connect(3000); 
    console.log(`Litter App is now exposed at ${url}`)
}
deploy()