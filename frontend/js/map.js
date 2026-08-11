// ==========================================
// GIS MAP SERVICE (LEAFLET.JS IMPLEMENTATION)
// ==========================================

let map;
let markerLayer;
let redirectionLine;

function initMap() {
    // Center of Kerala
    const keralaCenter = [9.85, 76.55];
    
    // Initialize map
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(keralaCenter, 8);

    // CartoDB Dark Matter tiles (sleek dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
}

function updateMapMarkers(destinations, selectedDestId = null, alternatives = []) {
    // Clear old markers and lines
    markerLayer.clearLayers();
    if (redirectionLine) {
        map.removeLayer(redirectionLine);
        redirectionLine = null;
    }

    const altIds = alternatives.map(a => a.destination.id);
    let selectedLatLng = null;
    const alternativeLatLngs = [];

    destinations.forEach(dest => {
        const ratio = dest.current_crowd / dest.carrying_capacity;
        let colorClass = 'green';
        
        if (dest.weather_index <= 0.3 || ratio >= 1.0) {
            colorClass = 'red';
        } else if (ratio >= 0.7) {
            colorClass = 'orange';
        }

        const isSelected = dest.id == selectedDestId;
        const isAlternative = altIds.includes(dest.id);

        if (isSelected) selectedLatLng = [dest.lat, dest.lon];
        if (isAlternative) alternativeLatLngs.push([dest.lat, dest.lon]);

        // Creating custom pin
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin ${colorClass} ${isSelected ? 'animate-pulse' : ''}" style="${isSelected ? 'transform: scale(1.3) rotate(-45deg); z-index: 1000;' : ''}"></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -36]
        });

        const popupContent = `
            <div style="font-family: 'Outfit', sans-serif; padding: 5px;">
                <h4 style="margin: 0 0 5px 0; color: #fff;">${dest.name}</h4>
                <p style="margin: 0 0 5px 0; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Category: ${dest.category.replace('_', ' ')}</p>
                <div style="margin-bottom: 5px; font-size: 0.8rem;">
                    <strong>Visitors:</strong> ${dest.current_crowd} / ${dest.carrying_capacity}
                    <span style="color: ${colorClass === 'red' ? '#ff3366' : (colorClass === 'orange' ? '#ff9f1c' : '#00f5a0')}">
                        (${Math.round(ratio * 100)}% Load)
                    </span>
                </div>
                <div style="font-size: 0.8rem; margin-bottom: 8px;">
                    <strong>Weather suitability:</strong> ${Math.round(dest.weather_index * 100)}%
                </div>
                <button onclick="selectDestinationFromMap(${dest.id})" style="background: linear-gradient(135deg, #00f5a0, #00d2ff); border: none; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; cursor: pointer; width: 100%;">
                    Select Destination
                </button>
            </div>
        `;

        const marker = L.marker([dest.lat, dest.lon], { icon: customIcon })
            .bindPopup(popupContent)
            .addTo(markerLayer);

        if (isSelected) {
            marker.openPopup();
        }
    });

    // Draw dynamic redirection lines
    if (selectedLatLng && alternativeLatLngs.length > 0) {
        const pathCoords = alternativeLatLngs.map(altLatLng => [selectedLatLng, altLatLng]);
        
        redirectionLine = L.polyline(pathCoords, {
            color: '#00f5a0',
            weight: 3,
            dashArray: '5, 8',
            opacity: 0.85
        }).addTo(map);

        // Zoom to fit the target and its alternatives
        const bounds = L.latLngBounds([selectedLatLng, ...alternativeLatLngs]);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else if (selectedLatLng) {
        // Zoom to the single selected spot
        map.setView(selectedLatLng, 10);
    }
}
