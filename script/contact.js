// This file contains JavaScript specific to the contact.html page.

let map = null; // To hold the map instance

function initializeMap() {
    // Check if the map has already been initialized to prevent re-initialization errors
    if (map) {
        map.remove(); // Remove the old map instance
    }

    const mapElement = document.getElementById('leaflet-map');
    // Ensure the map element exists before trying to initialize
    if (mapElement) {
        const collegeCoords = [19.0706, 72.8824]; // Coordinates for Don Bosco Institute of Technology

        // Initialize the map
        map = L.map('leaflet-map').setView(collegeCoords, 17); // Set view to college coordinates with zoom level 17

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker for the college location
        L.marker(collegeCoords).addTo(map)
            .bindPopup('<b>Don Bosco Institute of Technology</b><br>Kurla, Mumbai.')
            .openPopup();

        // Add event listener for the recenter button
        const recenterBtn = document.getElementById('recenter-map-btn');
        if (recenterBtn) {
            recenterBtn.addEventListener('click', () => {
                if (map) {
                    map.setView(collegeCoords, 17); // Recenter the map
                }
            });
        }
    } else {
        console.error("Leaflet map element not found or not visible.");
    }
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);

// Optional: Re-initialize map if the window is resized and map container dimensions change
// This is important if the map's container size changes dynamically
window.addEventListener('resize', () => {
    if (map) {
        map.invalidateSize(); // Recalculates the map's size
    }
});