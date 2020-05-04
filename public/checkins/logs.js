const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The temperature here at ${item.lat}&deg;,
    ${item.lon}&deg; is ${item.weather.temp.value}&deg; ${item.weather.temp.units} with
    wind from ${item.weather.wind_direction.value}&deg; at ${item.weather.wind_speed.value} [${item.weather.wind_speed.units}] <br />`;

    if (item.air.value < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  The concentration of particulate matter 
    (${item.air.parameter}) is ${item.air.value} 
    ${item.air.unit} (Recorded ${item.air.lastUpdated})`;
    }
    marker.bindPopup(txt);
  }
  console.log(data);
}