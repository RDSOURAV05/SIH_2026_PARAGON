// map.js - Leaflet Map Integration with CartoDB Dark Tiles

let map;
let markerGroup;
let routeGroup;
let markersMap = {}; // Stores references to markers by destination ID

// Initialize Leaflet Map
function initMap() {
    // Center of Kerala: [10.2, 76.4]
    map = L.map('map', {
        center: [10.2, 76.4],
        zoom: 8,
        minZoom: 7,
        maxZoom: 13,
        zoomControl: true,
        attributionControl: false,
        maxBounds: [[8.0, 74.5], [13.0, 78.5]], // strictly constrain view to Kerala
        maxBoundsViscosity: 1.0
    });

    // Define Base Layers
    const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20
    });

    const darkMode = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    });

    const lightMode = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    });

    // Default layer to minimalistic light Mode
    lightMode.addTo(map);

    const baseMaps = {
        "<span style='color: #0f172a; font-weight: 500;'>Light Map</span>": lightMode,
        "<span style='color: #0f172a; font-weight: 500;'>Satellite View</span>": satellite,
        "<span style='color: #0f172a; font-weight: 500;'>Dark Map</span>": darkMode
    };

    // Add Layer Control in one location on the map
    L.control.layers(baseMaps, null, { 
        position: 'topleft', 
        collapsed: false 
    }).addTo(map);

    // Initialize layer groups
    markerGroup = L.layerGroup().addTo(map);
    routeGroup = L.layerGroup().addTo(map);

    // Reposition zoom controls to top-right for dashboard style
    map.zoomControl.setPosition('topright');

    // Draw Kerala boundary cutout mask to hide other states
    const keralaCoordinates = [
        [12.78, 74.88], // Kasaragod north-west
        [12.60, 75.35], // Kasaragod north-east
        [12.05, 75.45], // Kannur east
        [11.75, 76.10], // Wayanad north-east
        [11.50, 76.45], // Nilgiris border
        [10.95, 76.70], // Palakkad east
        [10.20, 76.85], // Anamalai border
        [9.75, 77.25],  // Idukki east
        [9.15, 77.35],  // Pathanamthitta east
        [8.50, 77.20],  // Trivandrum east
        [8.20, 77.35],  // Padmanabhapuram area (Kanyakumari border)
        [8.28, 77.20],  // Trivandrum south (Neyyattinkara)
        [8.35, 76.90],  // Trivandrum coast
        [8.88, 76.50],  // Kollam coast
        [9.45, 76.25],  // Alappuzha coast
        [9.95, 76.20],  // Kochi coast
        [10.60, 75.95], // Thrissur coast
        [11.15, 75.80], // Kozhikode coast
        [12.00, 75.15], // Kannur coast
        [12.78, 74.88]  // Kasaragod coast (close loop)
    ];

    const outerBounds = [
        [0.0, 60.0],
        [0.0, 90.0],
        [25.0, 90.0],
        [25.0, 60.0]
    ];

    L.polygon([outerBounds, keralaCoordinates], {
        fillColor: '#f1f5f9',
        fillOpacity: 0.65,
        color: '#ea580c', // Glowing Theyyam orange border around Kerala
        weight: 3,
        opacity: 0.8,
        interactive: false
    }).addTo(map);
}

// Function to return CSS class based on crowd ratio
function getStatusClass(ratio) {
    if (ratio > 0.8) return 'overloaded';
    if (ratio >= 0.5) return 'moderate';
    return 'safe';
}

// Helper to capital-case string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Clear all markers from map
function clearMapMarkers() {
    markerGroup.clearLayers();
    markersMap = {};
}

// Update Map Markers with current state
function updateMapMarkers(destinations, selectedId) {
    clearMapMarkers();

    destinations.forEach(dest => {
        const ratio = dest.tourists / dest.capacity;
        let statusClass = getStatusClass(ratio);
        
        // If this is an alternative recommendation route target and the source is overloaded,
        // we can style it as 'alternative' if it's currently selected's recommendation
        const isSelected = dest.id === selectedId;
        
        // Define Custom Glowing Icon using L.divIcon
        const iconHtml = `
            <div class="custom-pin pin-${statusClass} ${isSelected ? 'selected-pin' : ''}" id="marker-${dest.id}">
                <div class="pin-ring"></div>
                <div class="pin-dot"></div>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });

        // Popup HTML Template
        const popupContent = `
            <div style="font-family: 'Outfit', sans-serif; padding: 4px;">
                <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; font-weight: 600; color: #fff;">${dest.name}</h4>
                <p style="margin: 0 0 4px 0; font-size: 0.8rem; color: #94a3b8;">
                    Type: <span style="color: #0ea5e9; font-weight: 500;">${dest.type}</span>
                </p>
                <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
                    <div>
                        <span style="display: block; font-size: 0.65rem; text-transform: uppercase; color: #64748b;">Tourists</span>
                        <span style="font-size: 0.85rem; font-weight: 600; color: #f8fafc;">${dest.tourists}</span>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.65rem; text-transform: uppercase; color: #64748b;">Status</span>
                        <span style="font-size: 0.85rem; font-weight: 600; color: ${statusClass === 'safe' ? '#10b981' : statusClass === 'moderate' ? '#f59e0b' : '#ef4444'}">${capitalize(statusClass)}</span>
                    </div>
                </div>
            </div>
        `;

        const marker = L.marker(dest.coords, { icon: customIcon })
            .bindPopup(popupContent, { closeButton: false })
            .addTo(markerGroup);

        // Bind click event to sync with UI select
        marker.on('click', () => {
            // Trigger selection in app.js
            if (window.selectDestination) {
                window.selectDestination(dest.id);
            }
        });

        // Store reference
        markersMap[dest.id] = marker;
        
        // Open popup if this destination is the currently selected one
        if (isSelected) {
            marker.openPopup();
        }
    });
}

function drawRedirectionRoute(sourceId, altDestinations) {
    routeGroup.clearLayers();

    const sourceDest = markersMap[sourceId];
    if (!sourceDest) return;

    const sourceCoords = sourceDest.getLatLng();
    const bounds = L.latLngBounds([sourceCoords]);

    altDestinations.forEach((alt, idx) => {
        const altMarker = markersMap[alt.id];
        if (!altMarker) return;

        const altCoords = altMarker.getLatLng();
        bounds.extend(altCoords);

        // Fetch driving directions from OSRM road routing engine
        const sourceQuery = `${sourceCoords.lng},${sourceCoords.lat}`;
        const destQuery = `${altCoords.lng},${altCoords.lat}`;
        const osrmUrl = `https://router.projectosrm.org/route/v1/driving/${sourceQuery};${destQuery}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
            .then(res => res.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const routeGeom = data.routes[0].geometry;
                    const latLngs = routeGeom.coordinates.map(coord => [coord[1], coord[0]]);
                    
                    // Draw actual road route line (glowing Theyyam orange)
                    L.polyline(latLngs, {
                        color: '#ea580c',
                        weight: 4.5,
                        opacity: 0.85,
                        className: 'route-polyline-glow'
                    }).addTo(routeGroup);
                } else {
                    drawFallbackStraightLine(sourceCoords, altCoords);
                }
            })
            .catch(() => {
                drawFallbackStraightLine(sourceCoords, altCoords);
            });

        // Add small decorative text marker at midpoint
        const midLat = (sourceCoords.lat + altCoords.lat) / 2;
        const midLng = (sourceCoords.lng + altCoords.lng) / 2;
        
        const labelHtml = `
            <div style="
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(234, 88, 12, 0.4);
                box-shadow: 0 0 10px rgba(234, 88, 12, 0.2);
                color: #ea580c;
                font-family: 'Outfit', sans-serif;
                font-size: 0.65rem;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
                white-space: nowrap;
            ">
                Reroute #${idx + 1}
            </div>
        `;
        
        L.marker([midLat, midLng], {
            icon: L.divIcon({
                html: labelHtml,
                className: 'route-midpoint-label',
                iconSize: [60, 20],
                iconAnchor: [30, 10]
            })
        }).addTo(routeGroup);
    });

    // Smoothly pan & zoom the map to fit all route endpoints
    map.flyToBounds(bounds.pad(0.2), {
        animate: true,
        duration: 1.2
    });
}

function drawFallbackStraightLine(sourceCoords, altCoords) {
    L.polyline([sourceCoords, altCoords], {
        color: '#ea580c',
        weight: 3.5,
        dashArray: '6, 10',
        opacity: 0.85,
        className: 'route-polyline-glow'
    }).addTo(routeGroup);
}

// Clear active routes
function clearRoute() {
    routeGroup.clearLayers();
}

// Focus on a specific destination
function focusDestination(id) {
    const marker = markersMap[id];
    if (marker) {
        map.panTo(marker.getLatLng(), { animate: true, duration: 0.8 });
        marker.openPopup();
    }
}

// Expose map controllers to window context
window.initMap = initMap;
window.updateMapMarkers = updateMapMarkers;
window.drawRedirectionRoute = drawRedirectionRoute;
window.clearRoute = clearRoute;
window.focusDestination = focusDestination;
