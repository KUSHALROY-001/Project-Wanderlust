const redIcon = L.icon({
  // Custom red marker icon
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const coordinates = window.listingCoordinates;
// GeoJSON order: [lng, lat]

const map = L.map("map").setView([coordinates[1], coordinates[0]], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.marker([coordinates[1], coordinates[0]], { icon: redIcon })
  .addTo(map)
  .bindPopup(window.listingLocation)
  .openPopup();

  map.scrollWheelZoom.disable();
