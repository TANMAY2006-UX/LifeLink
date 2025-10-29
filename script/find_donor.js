// Global variables for map and markers
let map;
let userMarker;
let donorMarkers = [];
let userLocation = null;
const DONORS_PER_PAGE = 3; // Number of donors to show initially

// Sample donor data with real Mumbai area coordinates
const donorDatabase = [
    { id: 1, name: "Rahul Sharma", bloodGroup: "O+", phone: "+91-9876543210", location: "Vashi", lat: 19.0770, lng: 73.0169, lastDonation: "2 months ago" },
    { id: 2, name: "Priya Patel", bloodGroup: "A+", phone: "+91-9876543211", location: "Vashi Sector 15", lat: 19.0820, lng: 73.0200, lastDonation: "3 months ago" },
    { id: 3, name: "Amit Kumar", bloodGroup: "B+", phone: "+91-9876543212", location: "Vashi Station", lat: 19.0769, lng: 73.0169, lastDonation: "1 month ago" },
    { id: 4, name: "Sneha Joshi", bloodGroup: "O+", phone: "+91-9876543213", location: "Thane West", lat: 19.2183, lng: 72.9781, lastDonation: "2 months ago" },
    { id: 5, name: "Vikram Singh", bloodGroup: "AB+", phone: "+91-9876543214", location: "Thane East", lat: 19.2056, lng: 72.9869, lastDonation: "4 months ago" },
    { id: 6, name: "Kavita Mehta", bloodGroup: "A-", phone: "+91-9876543215", location: "Naupada Thane", lat: 19.1866, lng: 72.9781, lastDonation: "1 month ago" },
    { id: 7, name: "Rajesh Gupta", bloodGroup: "O-", phone: "+91-9876543216", location: "Panvel", lat: 19.0023, lng: 73.1159, lastDonation: "3 months ago" },
    { id: 8, name: "Sunita Rao", bloodGroup: "B-", phone: "+91-9876543217", location: "New Panvel", lat: 19.0330, lng: 73.1275, lastDonation: "2 months ago" },
    { id: 9, name: "Manoj Tiwari", bloodGroup: "A+", phone: "+91-9876543218", location: "Sion", lat: 19.0434, lng: 72.8635, lastDonation: "1 month ago" },
    { id: 10, name: "Deepika Shah", bloodGroup: "O+", phone: "+91-9876543219", location: "Sion East", lat: 19.0456, lng: 72.8678, lastDonation: "2 months ago" },
    { id: 11, name: "Arjun Nair", bloodGroup: "AB-", phone: "+91-9876543220", location: "Matunga", lat: 19.0270, lng: 72.8570, lastDonation: "3 months ago" },
    { id: 12, name: "Pooja Desai", bloodGroup: "B+", phone: "+91-9876543221", location: "Matunga East", lat: 19.0330, lng: 72.8640, lastDonation: "1 month ago" },
    { id: 13, name: "Kiran Patil", bloodGroup: "O+", phone: "+91-9876543222", location: "Dadar", lat: 19.0178, lng: 72.8478, lastDonation: "2 months ago" },
    { id: 14, name: "Neha Agarwal", bloodGroup: "A+", phone: "+91-9876543223", location: "Bandra", lat: 19.0596, lng: 72.8295, lastDonation: "1 month ago" },
    { id: 15, name: "Rohit Jain", bloodGroup: "B+", phone: "+91-9876543224", location: "Andheri", lat: 19.1136, lng: 72.8697, lastDonation: "3 months ago" },
    { id: 16, name: "Suresh Rao", bloodGroup: "O+", phone: "+91-9876543225", location: "Ghatkopar", lat: 19.0863, lng: 72.9099, lastDonation: "1 month ago" },
    { id: 17, name: "Anjali Singh", bloodGroup: "A+", phone: "+91-9876543226", location: "Chembur", lat: 19.0519, lng: 72.9015, lastDonation: "2 months ago" },
    { id: 18, name: "Rajat Desai", bloodGroup: "B+", phone: "+91-9876543227", location: "Powai", lat: 19.1337, lng: 72.9159, lastDonation: "3 months ago" },
    { id: 19, name: "Shweta Kulkarni", bloodGroup: "AB+", phone: "+91-9876543228", location: "Colaba", lat: 18.9152, lng: 72.8228, lastDonation: "1 month ago" },
    { id: 20, name: "Gaurav Soni", bloodGroup: "O+", phone: "+91-9876543229", location: "Bhandup", lat: 19.1481, lng: 72.9461, lastDonation: "4 months ago" }
];

// Location coordinates for major Mumbai areas
const locationCoordinates = {
    'vashi': { lat: 19.0770, lng: 73.0169, name: 'Vashi' },
    'thane': { lat: 19.2183, lng: 72.9781, name: 'Thane' },
    'panvel': { lat: 19.0023, lng: 73.1159, name: 'Panvel' },
    'sion': { lat: 19.0434, lng: 72.8635, name: 'Sion' },
    'matunga': { lat: 19.0270, lng: 72.8570, name: 'Matunga' },
    'dadar': { lat: 19.0178, lng: 72.8478, name: 'Dadar' },
    'bandra': { lat: 19.0596, lng: 72.8295, name: 'Bandra' },
    'andheri': { lat: 19.1136, lng: 72.8697, name: 'Andheri' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    'navi mumbai': { lat: 19.0330, lng: 73.0297, name: 'Navi Mumbai' },
    'ghatkopar': { lat: 19.0863, lng: 72.9099, name: 'Ghatkopar' },
    'chembur': { lat: 19.0519, lng: 72.9015, name: 'Chembur' },
    'powai': { lat: 19.1337, lng: 72.9159, name: 'Powai' },
    'colaba': { lat: 18.9152, lng: 72.8228, name: 'Colaba' },
    'bhandup': { lat: 19.1481, lng: 72.9461, name: 'Bhandup' }
};

// DOM elements
const userLocationInput = document.getElementById('userLocation');
const bloodGroupSelect = document.getElementById('bloodGroup');
const donorListContainer = document.getElementById('donorList');
const locationInfoEl = document.getElementById('locationInfo');
const modalMessageEl = document.getElementById('modal-message');
const modalTextEl = document.getElementById('modal-text');
const viewMoreContainer = document.getElementById('viewMoreContainer');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const donorModal = document.getElementById('donor-modal');
const allDonorListContainer = document.getElementById('allDonorList');
let currentFilteredDonors = [];

// Main search function triggered by the search button
function searchDonors() {
    const userLocationInputValue = userLocationInput.value.trim();
    const bloodGroupFilter = bloodGroupSelect.value;

    const userCoords = findLocationCoordinates(userLocationInputValue);
    if (userCoords) {
        userLocation = { lat: userCoords.lat, lng: userCoords.lng, name: userCoords.name };
        if (userMarker) map.removeLayer(userMarker);
        addUserMarker(userCoords.lat, userCoords.lng, userCoords.name);
        updateLocationInfo(`📍 Your location: ${userCoords.name}`);
    } else if (!userLocation) {
        showModal('Please enter a valid location or use your current location.');
        return;
    }

    let filteredDonors = donorDatabase;
    if (bloodGroupFilter) {
        filteredDonors = filteredDonors.filter(donor => donor.bloodGroup === bloodGroupFilter);
    }

    filteredDonors = filteredDonors.filter(donor => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, donor.lat, donor.lng);
        donor.distanceFromUser = distance;
        return distance <= 20; // 20km radius
    });

    filteredDonors.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
    currentFilteredDonors = filteredDonors;

    map.setView([userLocation.lat, userLocation.lng], 13);
    addDonorMarkers(filteredDonors);
    updateDonorList(filteredDonors);
}

// Reset to user location
function resetToUserLocation() {
    if (!userLocation) {
        showModal('Please set your location first by typing or using the "Current Location" button.');
        return;
    }
    
    map.setView([userLocation.lat, userLocation.lng], 13);
    addDonorMarkers([]); 
    updateDonorList([]); 
    userLocationInput.value = userLocation.name; 
    bloodGroupSelect.value = ''; 
    updateLocationInfo('📍 Back to your location');
}

// Get current location using browser's geolocation API
function getCurrentLocation() {
    if (navigator.geolocation) {
        updateLocationInfo('🎯 Getting your location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                userLocation = { lat, lng, name: "Current Location" };
                if (userMarker) map.removeLayer(userMarker);
                addUserMarker(lat, lng, "Your Current Location");
                map.setView([lat, lng], 14);
                updateLocationInfo('📍 Current location detected');
                userLocationInput.value = 'My Current Location';
            },
            function(error) {
                showModal('Could not get your location. Please enter it manually or check your browser settings.');
                updateLocationInfo('📍 Location access denied');
            }
        );
    } else {
        showModal('Geolocation is not supported by this browser. Please enter your location manually.');
    }
}

// Shows a custom modal with a message.
function showModal(message) {
    modalTextEl.textContent = message;
    modalMessageEl.style.display = 'flex';
}

// Initialize map
function initMap() {
    if (map) {
        map.remove();
    }

    userLocation = locationCoordinates['mumbai'];
    userLocationInput.value = userLocation.name;
    updateLocationInfo(`📍 Your current location: ${userLocation.name}`);

    map = L.map('map').setView([userLocation.lat, userLocation.lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userLocation = { lat: e.latlng.lat, lng: e.latlng.lng, name: "Custom Location" };
        addUserMarker(e.latlng.lat, e.latlng.lng, "Selected Location");
        updateLocationInfo("📍 Location selected on map");
        userLocationInput.value = 'Custom Location';
    });
    
    addUserMarker(userLocation.lat, userLocation.lng, userLocation.name);
}

// Add user marker
function addUserMarker(lat, lng, title) {
    const userIcon = L.divIcon({
        html: '<div style="background: #dc2626; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">📍</div>',
        iconSize: [30, 30],
        className: 'custom-user-marker'
    });

    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`<b>Your Location</b><br>${title}`);
}

// Add donor markers
function addDonorMarkers(donors) {
    donorMarkers.forEach(marker => map.removeLayer(marker));
    donorMarkers = [];

    if (donors.length === 0) {
        return;
    }

    const bounds = L.latLngBounds();
    if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
    }
    
    donors.forEach(donor => {
        const donorIcon = L.divIcon({
            html: `<div style="background: #880808; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${donor.bloodGroup}</div>`,
            iconSize: [30, 30],
            className: 'custom-donor-marker'
        });

        const marker = L.marker([donor.lat, donor.lng], { icon: donorIcon }).addTo(map);
        
        const popupContent = `
            <div class="p-2">
                <h4 class="font-bold text-red-600">${donor.name}</h4>
                <p class="text-sm"><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
                <p class="text-sm"><strong>Location:</strong> ${donor.location}</p>
                <p class="text-sm"><strong>Phone:</strong> ${donor.phone}</p>
                <p class="text-sm"><strong>Last Donation:</strong> ${donor.lastDonation}</p>
                ${userLocation ? `<p class="text-sm text-blue-600 font-medium mt-1">📏 ${donor.distanceFromUser.toFixed(1)} km away</p>` : ''}
                <button onclick="contactDonor('${donor.name}', '${donor.phone}')" class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Contact</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        donorMarkers.push(marker);
        bounds.extend([donor.lat, donor.lng]);
    });

    if (donors.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Search for location coordinates from our predefined list
function findLocationCoordinates(locationName) {
    const searchTerm = locationName.toLowerCase().trim();
    for (const key in locationCoordinates) {
        if (key.includes(searchTerm) || searchTerm.includes(key)) {
            return locationCoordinates[key];
        }
    }
    return null;
}

// Update location info display
function updateLocationInfo(text) {
    locationInfoEl.textContent = text;
}

// Update donor list display with a maximum of 3 donors and a "View More" button.
function updateDonorList(donors) {
    if (donors.length === 0) {
        donorListContainer.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <div class="text-4xl mb-2">😔</div>
                <p>No donors found in this area</p>
                <p class="text-sm mt-2">Try searching with a different blood group</p>
            </div>
        `;
        viewMoreContainer.classList.add('hidden');
        return;
    }

    const donorsToShow = donors.slice(0, DONORS_PER_PAGE);
    donorListContainer.innerHTML = donorsToShow.map(donor => createDonorCard(donor)).join('');
    
    if (donors.length > DONORS_PER_PAGE) {
        viewMoreContainer.classList.remove('hidden');
    } else {
        viewMoreContainer.classList.add('hidden');
    }
}

// Create an HTML card for a donor
function createDonorCard(donor) {
    return `
        <div class="donor-card bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="flex justify-between items-start mb-2">
                <h5 class="font-semibold text-gray-800">${donor.name}</h5>
                <span class="distance-badge">${donor.bloodGroup}</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">📍 ${donor.location}</p>
            <p class="text-sm text-gray-600 mb-1">📞 ${donor.phone}</p>
            <p class="text-sm text-gray-600 mb-3">🩸 Last donated: ${donor.lastDonation}</p>
            ${userLocation ? `<p class="text-sm text-blue-600 font-medium mb-3">📏 ${donor.distanceFromUser.toFixed(1)} km away</p>` : ''}
            <div class="flex gap-2">
                <button onclick="contactDonor('${donor.name}', '${donor.phone}')" 
                        class="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Contact Donor
                </button>
            </div>
        </div>
    `;
}

// Display all donors in a modal
function displayAllDonors() {
    allDonorListContainer.innerHTML = currentFilteredDonors.map(donor => createDonorCard(donor)).join('');
    donorModal.style.display = 'flex';
}

// Contact donor via WhatsApp
function contactDonor(name, phone) {
    const message = `Hello ${name}, I found your contact through LifeLink. I need blood donation assistance. Can you please help?`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add event listeners to buttons
document.getElementById('search-btn').addEventListener('click', searchDonors);
document.getElementById('reset-btn').addEventListener('click', resetToUserLocation);
document.getElementById('current-location-btn').addEventListener('click', getCurrentLocation);
document.getElementById('hotline-btn').addEventListener('click', () => {
    showModal("In an emergency, please call our hotline number: +91-9876543210. You will be connected to a dedicated NSS volunteer for immediate assistance.");
});
viewMoreBtn.addEventListener('click', displayAllDonors);

// Close modals when clicking outside of them
modalMessageEl.addEventListener('click', function(e) {
    if (e.target === modalMessageEl) {
        modalMessageEl.style.display = 'none';
    }
});

donorModal.addEventListener('click', function(e) {
    if (e.target === donorModal) {
        donorModal.style.display = 'none';
    }
});

// Safe init that doesn't overwrite other handlers and checks for Leaflet
function safeInitMap() {
  try {
    if (!window.L) { console.error('Leaflet not loaded (L is undefined)'); return; }
    console.log('safeInitMap running — initializing map');
    initMap();
  } catch (err) {
    console.error('initMap error:', err);
  }
}

// If DOM already interactive, run soon; otherwise wait for load.
// Use 'load' to ensure external assets (tile requests etc) are OK.
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(safeInitMap, 0);
} else {
  window.addEventListener('load', safeInitMap);
}


