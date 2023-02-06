// const mongoose = require("mongoose");

// const url = "mongodb://localhost:27017/fullstack"

//const url = "mongodb+srv://admin-kamsey:D1MX02jndmNBE7OE@cluster0.wf7xh.mongodb.net/?retryWrites=true&w=majority"

const db = mongoose.connect(url,{useNewUrlParser:true},(err)=>{
    if(err) throw err
    console.log("Database Connected...");
})

module.exports = db

