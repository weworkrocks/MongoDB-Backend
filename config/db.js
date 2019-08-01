const mongoose = require('mongoose');
const  config = require('config');
const db = config.get('mongoURI');

//this gives us a promise
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });

        console.log("MongoDB Connected...");
    } catch(err) {
        //Exit process with failuar
        process.exit(1);
    }
}

module.exports = connectDB;