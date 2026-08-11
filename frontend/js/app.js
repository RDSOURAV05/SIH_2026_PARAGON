// ==========================================
// APP CONTROLLER & API GATEWAY INTEGRATION
// ==========================================

let destinationsData = [];
let activeDestinationId = null;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadDestinations();

    // Event listeners
    document.getElementById('plan-btn').addEventListener('click', calculateItinerary);
    document.getElementById('destination-select').addEventListener('change', (e) => {
        if (e.target.value) {
            onDestinationSelected(parseInt(e.target.value));
        } else {
            resetItineraryCard();
        }
    });
});

async function loadDestinations() {
    try {
        const response = await fetch('/api/destinations');
        destinationsData = await response.json();
        
        populateDropdown(destinationsData);
        updateMapMarkers(destinationsData, activeDestinationId);
    } catch (err) {
        console.error("Failed to load destinations:", err);
    }
}

function populateDropdown(destinations) {
    const select = document.getElementById('destination-select');
    
    // Clear old options except the first one
    select.innerHTML = '<option value="">-- Choose a Destination --</option>';
    
    destinations.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.id;
        
        // Show status indicators in text
        const ratio = dest.current_crowd / dest.carrying_capacity;
        let suffix = '(Normal)';
        if (dest.weather_index <= 0.3) {
            suffix = '(⚠️ Alert)';
        } else if (ratio >= 1.0) {
            suffix = '(❌ Full)';
        } else if (ratio >= 0.7) {
            suffix = '(⚠️ Busy)';
        }
        
        option.textContent = `${dest.name} ${suffix}`;
        select.appendChild(option);
    });

    if (activeDestinationId) {
        select.value = activeDestinationId;
    }
}

function selectDestinationFromMap(destId) {
    document.getElementById('destination-select').value = destId;
    onDestinationSelected(destId);
    calculateItinerary();
}

async function onDestinationSelected(destId) {
    activeDestinationId = destId;
    
    try {
        // Fetch detailed forecast data
        const response = await fetch(`/api/destinations/${destId}`);
        const data = await response.json();
        
        renderForecast(data.destination, data.forecasts);
    } catch (err) {
        console.error("Error fetching destination details:", err);
    }
}

async function calculateItinerary() {
    const destSelect = document.getElementById('destination-select');
    const selectedId = destSelect.value;
    
    if (!selectedId) {
        alert("Please select a target destination first.");
        return;
    }

    // Get checked preferences
    const preferences = [];
    document.querySelectorAll('input[name="preferences"]:checked').forEach(cb => {
        preferences.push(cb.value);
    });

    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                preferences: preferences,
                target_destination_id: parseInt(selectedId)
            })
        });
        
        const recResult = await response.json();
        renderRedirections(recResult);
        updateMapMarkers(destinationsData, parseInt(selectedId), recResult.recommendations);
    } catch (err) {
        console.error("Error calculating recommendation:", err);
    }
}

function renderRedirections(data) {
    const card = document.getElementById('redirection-card');
    const alertContent = document.getElementById('alert-content');
    const altList = document.getElementById('alternatives-list');
    
    if (!data.is_congested) {
        // If not congested, hide the redirection card
        card.classList.add('hidden');
        return;
    }

    // Show redirection suggestions
    card.classList.remove('hidden');
    
    alertContent.innerHTML = `
        <div class="alert-box">
            <i class="fa-solid fa-circle-exclamation"></i>
            ${data.alert_message}
            <br><small>Current capacity occupancy is at <strong>${Math.round(data.congestion_ratio * 100)}%</strong>.</small>
        </div>
    `;

    altList.innerHTML = '';
    
    if (data.recommendations.length === 0) {
        altList.innerHTML = '<p class="admin-desc">No suitable alternative destinations found nearby matching capacity constraints.</p>';
        return;
    }

    data.recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'alternative-item';
        item.onclick = () => selectDestinationFromMap(rec.destination.id);
        
        item.innerHTML = `
            <div class="alt-header">
                <span class="alt-name">${rec.destination.name}</span>
                <span class="alt-score">Match Score: ${Math.round(rec.score * 100)}%</span>
            </div>
            <div class="alt-details">
                <i class="fa-solid fa-route"></i> ${rec.distance_km} km away | 
                <i class="fa-solid fa-users"></i> Load: ${Math.round((rec.destination.current_crowd / rec.destination.carrying_capacity) * 100)}%
            </div>
            <div class="alt-reason">${rec.redirection_reason}</div>
            <div class="alt-incentive">
                <i class="fa-solid fa-gift"></i> ${rec.incentive_text}
            </div>
        `;
        altList.appendChild(item);
    });
}

function renderForecast(destination, forecasts) {
    document.getElementById('forecast-spot-name').textContent = destination.name;
    
    // Set active capacity bar
    const ratio = destination.current_crowd / destination.carrying_capacity;
    const bar = document.getElementById('forecast-bar');
    const ratioText = document.getElementById('forecast-ratio-text');
    
    const percentage = Math.min(100, Math.round(ratio * 100));
    bar.style.width = `${percentage}%`;
    
    // Color status
    bar.className = 'capacity-bar';
    if (destination.weather_index <= 0.3 || ratio >= 1.0) {
        bar.classList.add('red');
    } else if (ratio >= 0.7) {
        bar.classList.add('orange');
    }
    
    ratioText.innerHTML = `Current: <strong>${destination.current_crowd}</strong> / Carrying Capacity: <strong>${destination.carrying_capacity}</strong> (${percentage}% load)`;

    // Draw chart bars
    const chart = document.getElementById('chart-bars');
    chart.innerHTML = '';
    
    forecasts.forEach(fc => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'chart-bar-wrapper';
        
        const maxBarHeight = 80; // px
        const fillHeight = Math.min(maxBarHeight, Math.round(fc.capacity_ratio * maxBarHeight));
        
        let loadClass = 'normal';
        if (fc.status === 'Congested') {
            loadClass = 'congested';
        } else if (fc.status === 'Moderate') {
            loadClass = 'moderate';
        }
        
        barWrapper.innerHTML = `
            <div class="chart-bar-fill ${loadClass}" style="height: ${fillHeight}px">
                <div class="chart-bar-tooltip">
                    ${fc.predicted_crowd} pax (${Math.round(fc.capacity_ratio * 100)}%)
                </div>
            </div>
            <span class="chart-bar-label">${fc.hour}</span>
        `;
        chart.appendChild(barWrapper);
    });
}

function resetItineraryCard() {
    document.getElementById('redirection-card').classList.add('hidden');
    document.getElementById('forecast-spot-name').textContent = 'Select a destination to view forecast';
    document.getElementById('forecast-bar').style.width = '0%';
    document.getElementById('forecast-ratio-text').textContent = '';
    document.getElementById('chart-bars').innerHTML = '';
    activeDestinationId = null;
    updateMapMarkers(destinationsData, null);
}

// ==========================================
// SIMULATION FUNCTIONS
// ==========================================

async function simulateCrowd(destId, crowdCount) {
    try {
        const response = await fetch(`/api/simulate/crowd?dest_id=${destId}&crowd=${crowdCount}`, {
            method: 'POST'
        });
        const res = await response.json();
        
        // Refresh local data
        await loadDestinations();
        
        if (activeDestinationId == destId) {
            onDestinationSelected(destId);
            calculateItinerary();
        }
        
        // Show status feedback
        flashAlertFeedback(res.message);
    } catch (err) {
        console.error("Simulation failed:", err);
    }
}

async function simulateWeather(destId, weatherIndex) {
    try {
        const response = await fetch(`/api/simulate/weather?dest_id=${destId}&index=${weatherIndex}`, {
            method: 'POST'
        });
        const res = await response.json();
        
        // Refresh local data
        await loadDestinations();
        
        if (activeDestinationId == destId) {
            onDestinationSelected(destId);
            calculateItinerary();
        }
        
        flashAlertFeedback(res.message);
    } catch (err) {
        console.error("Simulation failed:", err);
    }
}

function flashAlertFeedback(msg) {
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.right = '20px';
    banner.style.background = 'rgba(15, 23, 42, 0.95)';
    banner.style.color = '#00f5a0';
    banner.style.border = '1px solid #00f5a0';
    banner.style.padding = '10px 20px';
    banner.style.borderRadius = '8px';
    banner.style.zIndex = '9999';
    banner.style.fontFamily = "'Outfit', sans-serif";
    banner.style.fontSize = '0.85rem';
    banner.style.boxShadow = '0 0 15px rgba(0, 245, 160, 0.2)';
    banner.textContent = msg;
    
    document.body.appendChild(banner);
    setTimeout(() => {
        banner.style.transition = 'opacity 0.5s';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
    }, 2500);
}
