const jwt = require('jsonwebtoken');
function generateToken(data={},SECRET_KEY=process.env.JWT_SECRET){
    // Get current timestamp in seconds
const now = Math.floor(Date.now() / 1000);

// Calculate expiration time (24 hours from now)
const expirationTime = now + 86400;

var token=jwt.sign(data,SECRET_KEY,{
    expiresIn:expirationTime
})
console.log(token)
return token;
}
module.exports={
    generateToken
}