const coordinates = window.listingCoordinates;
// GeoJSON order: [lng, lat]

const map = L.map("map").setView([coordinates[1], coordinates[0]], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.geoJSON({
  type: "Point",
  coordinates: coordinates,
}).addTo(map);
