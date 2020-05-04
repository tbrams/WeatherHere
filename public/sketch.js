// Geo Locate
let lat, lon;
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      const api_url = `weather/${lat},${lon}`;
      const response = await fetch(api_url);
      const json = await response.json();

      // console.log(json);

      weather = json.weather;      
      document.getElementById('temp_value').textContent = weather.temp.value + '° ';
      document.getElementById('temp_units').textContent = weather.temp.units;
      document.getElementById('wind_speed').textContent = weather.wind_speed.value;
      document.getElementById('wind_speed_units').textContent = weather.wind_speed.units;
      document.getElementById('wind_direction').textContent = weather.wind_direction.value;
      document.getElementById('wind_direction_units').textContent = weather.wind_direction.units;
      document.getElementById('wind_gust').textContent = weather.wind_gust.value;
      document.getElementById('wind_gust_units').textContent = weather.wind_gust.units;

      if (json.air_quality.results.length>0) {


      air = json.air_quality.results[0].measurements[0];
      document.getElementById('aq_parameter').textContent = air.parameter;
      document.getElementById('aq_value').textContent = air.value;
      document.getElementById('aq_units').textContent = air.unit;
      document.getElementById('aq_date').textContent = air.lastUpdated;
    } else {
        document.getElementById('aq').textContent = "No Air quality reading.";
        air = { value: -1 };
    }

    } catch (error) {
      console.error(error);
    }

    // Post in database 
    // Could probably be done directly on the server, but serves as a good
    // example on how to interact with a db from the client side, so I will
    // keep it like this for now

    const data = { lat, lon, weather, air };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log(db_json);
  });
} else {
  console.log('geolocation not available');
}