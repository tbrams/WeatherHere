const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

// Get API_KEY from config file
require('dotenv').config();
const API_KEY=process.env.API_KEY;

const app = express();

// Check if a PORT has already been assigned by hosting provider, otherwise
// use default port 3000 (on localhost)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  
  const weather_items = ['temp', 'wind_speed', 'wind_direction', 'wind_gust'];
  let weather_params='fields=';
  weather_params+=weather_items.join('%2C');
  const weather_url=`https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${lon}&unit_system=si&${weather_params}&apikey=${API_KEY}`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    air_quality: aq_data
  };
  response.json(data);
});