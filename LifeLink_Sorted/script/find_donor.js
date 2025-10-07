// This file contains JavaScript specific to the find-donor.html page.

// Leaflet Map Initialization and Logic
let map; // To hold the map instance
let marker; // To hold the marker instance
let donorMarkers = []; // To store multiple donor markers

// Sample donor data with approximate coordinates
const sampleDonors = [
  { name: "Priya Sharma", bloodGroup: "O+", location: "Kurla West (1.2 km away)", lat: 19.0760, lng: 72.8777 },
  { name: "Rahul Verma", bloodGroup: "A-", location: "Ghatkopar (2.5 km away)", lat: 19.0863, lng: 72.9099 },
  { name: "Anjali Singh", bloodGroup: "B+", location: "Chembur (3.0 km away)", lat: 19.0519, lng: 72.9015 }
];

// Function to initialize the map
function initializeMap() {
    if (map) {
        map.remove();
    }
    map = L.map('map').setView([19.0760, 72.8777], 12); // Centered on Kurla, Mumbai
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map)
            .bindPopup('Your selected location.')
            .openPopup();
        document.getElementById('search-location').value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    });
}

// Function to add donor markers to the map
function addDonorMarkersToMap(donors) {
    donorMarkers.forEach(m => map.removeLayer(m));
    donorMarkers = [];

    let bounds = L.latLngBounds([]);

    donors.forEach((donor, index) => {
        const customIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: `<div style="background-color: #880808; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${index + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -25]
        });

        const donorMarker = L.marker([donor.lat, donor.lng], { icon: customIcon }).addTo(map)
            .bindPopup(`<b>Donor ${index + 1}: ${donor.name}</b><br>Blood Group: ${donor.bloodGroup}<br>${donor.location}`);
        donorMarkers.push(donorMarker);
        bounds.extend([donor.lat, donor.lng]);
    });

    if (donors.length > 0) {
        map.fitBounds(bounds.pad(0.5));
    }
}


// Event listeners for the page
const searchBtn = document.getElementById('search-donor-btn');
const resultsSection = document.getElementById('search-results');
const backToHomeLogo = document.querySelector('.navbar .logo a');


searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    addDonorMarkersToMap(sampleDonors);
});

// A temporary fix for a non-working link
if(backToHomeLogo) backToHomeLogo.href = 'index.html';

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});