const mongoose = require('mongoose');
require("dotenv").config();
function getconnection(){
    if(process.env.NODE_ENV==="development"){
        return process.env.MONGO_DB_DEV
    }else if(process.env.NODE_ENV==="production"){
        return process.env.MONGO_DB_PROD
    }
}
async function dbConnection(){
    const connectionUri=getconnection()
    try{
      
        const connection= await mongoose.connect(connectionUri)
            if(connection){
                console.log("DB connection Established")
            }else{
                throw new Error("DB connection could not be established")
            }
    }catch(error){
        console.log(error)
    }
   
}
dbConnection();
