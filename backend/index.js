const express = require("express")
const dbconnect=require("../backend/config/database");
const weatherApi = require("./Router/Weather");


const app= express()
app.use(express.json());
app.use("/api", weatherApi);


app.listen(3000,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();