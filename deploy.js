const ngrok = require("ngrok")
require('dotenv').config()
console.log("Please ensure your ngrok authtoken is placed in the .env file within the same directory as this file")
async function deploy() {
    await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);
    const url = await ngrok.connect(3000); 
    console.log(`Litter App is now exposed at ${url}`)
}
deploy()