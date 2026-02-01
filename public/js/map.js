// Initialize map
let map = L.map("map").setView([22.5726, 88.3639], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Marker
let marker = L.marker([22.5726, 88.3639]).addTo(map);
marker.bindPopup("<b>Kolkata</b><br>Web Dev Project").openPopup();
