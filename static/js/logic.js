var tilemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  }
);

var map = L.map("mapid", {
  center: [30,-50],
  zoom: 4,
  layers: [tilemap]
})

function getStyle(feature) {
  return {
    fillColor: getColor(feature.geometry.coordinates[2]),
    radius: getRadius(feature.properties.mag),
    stroke: false, 
    fillOpacity: 0.70
  }

}
function getRadius(mag) {
  return mag*2
}
function getColor(depth) {
  if(depth>90) {
    return "red"
  }
  else if (depth>70) {
    return "tomato"
  }
  else if (depth>50) {
    return "orange"
  }
  else if (depth>30) {
    return "yellow"
  }
  else if (depth>10) {
    return "yellowgreen"
  }
  else {
    return "green"
  }
}


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson").then(function(data){
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)

    },
    style: getStyle, 
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        feature.properties.place
      )

    }

  }).addTo(map)

  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(){
    var div=L.DomUtil.create("div", "legend info")
    var tags = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"]
    var colors = ["green", "yellowgreen", "yellow", "orange", "tomato", "red"]
    
    for(var i=0;i<tags.length;i++){
      div.innerHTML += `<div><i style="background: ${colors[i]}"></i><span>${tags[i]}</span></div>`
    }
    return div
  }
  legend.addTo(map)
})