let geodata_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 5;
  }

function markerColor(depth) {
    if (depth <= 10) return "lightgreen";
    else if (depth <= 30 ) return "yellowgreen";
    else if (depth <= 50) return "yellow";
    else if (depth <= 70) return "orange";
    else if (depth  <= 90) return "darkorange";
    else return "red";
  }

function geoStyle(dimensions) {
  return{
    color: "black",
    fillColor: markerColor(dimensions.geometry.coordinates[2]),
    radius: markerSize(dimensions.properties.mag),
    stroke: true,
    weight: 1,
    opacity: 1,
    fillOpacity:1
  };
}


d3.json(geodata_url).then(function(geodata) {
  L.geoJson(geodata, {
      pointToLayer: function(dimensions, latlng) {
          let new_marker = L.circleMarker(latlng, geoStyle(dimensions));
          new_marker.bindPopup(`<h3>${dimensions.properties.place}</h3><hr><p>Magnitude: ${dimensions.properties.mag}<br>Depth: ${dimensions.geometry.coordinates[2]} km<br>Date: ${new Date(dimensions.properties.time)}</p>`);
          return new_marker;
      }
  }).addTo(myMap);

  let map_legend = L.control({ position: "topright" });

  map_legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend"),
          depths = [0, 10, 30, 50, 70, 90],
          colors = ["lightgreen", "yellowgreen", "yellow", "orange", "darkorange", "red"];

      for (let i = 0; i < colors.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');;
      }

      return div;
  };

  map_legend.addTo(myMap);
}).catch(function(error) {
  console.log(error);
});

