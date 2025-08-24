const express = require("express")
const dbconnect=require("../backend/config/database");
const weatherApi = require("./Router/Weather");


const app= express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", weatherApi);
app.use("/api",require("./Router/SupplierRoutes"));


app.listen(3000,()=>{
    console.log("server is running.")
})

// connnect with database;
dbconnect();