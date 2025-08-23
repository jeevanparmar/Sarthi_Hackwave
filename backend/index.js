const express = require("express")
const dbconnect=require("../backend/config/database");



const app= express()

app.listen(3000,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();