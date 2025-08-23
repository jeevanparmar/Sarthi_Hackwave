const axios =require("axios")

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

exports.getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.body;
    console.log("City",city);

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: "City or coordinates required" });
    }

    const params = {
      appid: API_KEY,
      units: "metric"
    };
    if (city) params.q = city;
    if (lat && lon) { params.lat = lat; params.lon = lon; }

    const response = await axios.get(BASE_URL, { params });
    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    return res.status(500).json({ error: "Failed to fetch weather data" , message:err.e});
  }
};


// module.exports = getWeather;