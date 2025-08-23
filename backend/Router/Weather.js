const express = require('express');
const router = express();
const {getWeather} = require("../Controller/WeatherAPi.cjs");
// import {getWeather} from "../Controller/WeatherAPi";

router.post("/weather",getWeather);
module.exports = router;

