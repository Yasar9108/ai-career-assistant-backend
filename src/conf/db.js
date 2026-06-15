const mongoose = require('mongoose');

function connectDb(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.debug("Server Connected to MongoDB");
    }).catch((err)=>{
        console.debug("Failed to connect to MongoDB");
        console.error("Error connecting to MongoDB: ", err);
    });
}

module.exports = connectDb;