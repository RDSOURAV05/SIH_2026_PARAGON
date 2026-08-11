// app.js - Dashboard Controller, Chart Manager, and Simulation Engine

// 1. Core State Management: Kerala Tourist Hotspots & Alternatives
const destinationsData = {
    munnar: {
        id: 'munnar',
        name: 'Munnar Tea Gardens',
        type: 'Hill Station',
        coords: [10.0889, 77.0595],
        capacity: 1200,
        simTourists: { normal: 720, weekend: 1050, peak: 1480, monsoon: 240 },
        tourists: 720,
        alternatives: ['vagamon', 'ponmudi', 'idukki']
    },
    wayanad: {
        id: 'wayanad',
        name: 'Wayanad Spice Hills',
        type: 'Hill Station',
        coords: [11.6854, 76.1320],
        capacity: 900,
        simTourists: { normal: 540, weekend: 780, peak: 1020, monsoon: 180 },
        tourists: 540,
        alternatives: ['silent_valley', 'nelliampathy']
    },
    thekkady: {
        id: 'thekkady',
        name: 'Thekkady Wildlife Sanctuary',
        type: 'Wildlife & Nature',
        coords: [9.6031, 77.1614],
        capacity: 1000,
        simTourists: { normal: 620, weekend: 890, peak: 1150, monsoon: 220 },
        tourists: 620,
        alternatives: ['idukki', 'vagamon']
    },
    vagamon: {
        id: 'vagamon',
        name: 'Vagamon Pine Meadows',
        type: 'Hill Station',
        coords: [9.6874, 76.9048],
        capacity: 800,
        simTourists: { normal: 290, weekend: 410, peak: 550, monsoon: 90 },
        tourists: 290,
        alternatives: ['ponmudi']
    },
    ponmudi: {
        id: 'ponmudi',
        name: 'Ponmudi Winding Valleys',
        type: 'Hill Station',
        coords: [8.7602, 77.1167],
        capacity: 600,
        simTourists: { normal: 140, weekend: 210, peak: 320, monsoon: 50 },
        tourists: 140,
        alternatives: []
    },
    idukki: {
        id: 'idukki',
        name: 'Idukki Arch Dam',
        type: 'Nature & Forest',
        coords: [9.8493, 76.9749],
        capacity: 800,
        simTourists: { normal: 310, weekend: 450, peak: 620, monsoon: 80 },
        tourists: 310,
        alternatives: ['vagamon']
    },
    nelliampathy: {
        id: 'nelliampathy',
        name: 'Nelliampathy Orchards',
        type: 'Hill Station',
        coords: [10.5332, 76.6938],
        capacity: 600,
        simTourists: { normal: 180, weekend: 270, peak: 390, monsoon: 60 },
        tourists: 180,
        alternatives: []
    },
    silent_valley: {
        id: 'silent_valley',
        name: 'Silent Valley National Park',
        type: 'Nature/Reserve',
        coords: [11.1306, 76.4287],
        capacity: 500,
        simTourists: { normal: 110, weekend: 150, peak: 220, monsoon: 40 },
        tourists: 110,
        alternatives: []
    },
    malampuzha: {
        id: 'malampuzha',
        name: 'Malampuzha Dam Gardens',
        type: 'Nature & Park',
        coords: [10.8251, 76.6823],
        capacity: 1000,
        simTourists: { normal: 480, weekend: 720, peak: 950, monsoon: 150 },
        tourists: 480,
        alternatives: ['nelliampathy']
    },
    alappuzha: {
        id: 'alappuzha',
        name: 'Alleppey Backwaters',
        type: 'Backwaters',
        coords: [9.4981, 76.3388],
        capacity: 1200,
        simTourists: { normal: 850, weekend: 1120, peak: 1450, monsoon: 280 },
        tourists: 850,
        alternatives: ['kumarakom', 'kollam', 'munroe_island']
    },
    kumarakom: {
        id: 'kumarakom',
        name: 'Kumarakom Lake Resorts',
        type: 'Backwaters',
        coords: [9.5935, 76.4262],
        capacity: 800,
        simTourists: { normal: 280, weekend: 410, peak: 580, monsoon: 100 },
        tourists: 280,
        alternatives: ['munroe_island']
    },
    kollam: {
        id: 'kollam',
        name: 'Kollam Gateway Canals',
        type: 'Backwaters',
        coords: [8.8932, 76.6141],
        capacity: 900,
        simTourists: { normal: 320, weekend: 480, peak: 650, monsoon: 90 },
        tourists: 320,
        alternatives: ['munroe_island', 'ashtamudi']
    },
    munroe_island: {
        id: 'munroe_island',
        name: 'Munroe Island Villages',
        type: 'Backwaters',
        coords: [8.9912, 76.6163],
        capacity: 600,
        simTourists: { normal: 190, weekend: 290, peak: 420, monsoon: 60 },
        tourists: 190,
        alternatives: []
    },
    kavvayi: {
        id: 'kavvayi',
        name: 'Kavvayi Backwaters',
        type: 'Backwaters',
        coords: [12.0722, 75.1843],
        capacity: 500,
        simTourists: { normal: 120, weekend: 180, peak: 260, monsoon: 40 },
        tourists: 120,
        alternatives: []
    },
    ashtamudi: {
        id: 'ashtamudi',
        name: 'Ashtamudi Lake Shores',
        type: 'Backwaters',
        coords: [8.9482, 76.5823],
        capacity: 700,
        simTourists: { normal: 210, weekend: 320, peak: 450, monsoon: 70 },
        tourists: 210,
        alternatives: []
    },
    kovalam: {
        id: 'kovalam',
        name: 'Kovalam Lighthouse Beach',
        type: 'Beach',
        coords: [8.4021, 76.9785],
        capacity: 1500,
        simTourists: { normal: 920, weekend: 1350, peak: 1680, monsoon: 310 },
        tourists: 920,
        alternatives: ['varkala', 'poovar', 'shanghumugham']
    },
    varkala: {
        id: 'varkala',
        name: 'Varkala Cliff Beach',
        type: 'Beach',
        coords: [8.7303, 76.7077],
        capacity: 1200,
        simTourists: { normal: 540, weekend: 790, peak: 1050, monsoon: 180 },
        tourists: 540,
        alternatives: ['poovar', 'shanghumugham']
    },
    fort_kochi: {
        id: 'fort_kochi',
        name: 'Fort Kochi Heritage',
        type: 'Coastal Heritage',
        coords: [9.9658, 76.2421],
        capacity: 1500,
        simTourists: { normal: 780, weekend: 1150, peak: 1420, monsoon: 250 },
        tourists: 780,
        alternatives: ['marari']
    },
    marari: {
        id: 'marari',
        name: 'Marari Fishing Beach',
        type: 'Beach',
        coords: [9.6015, 76.2974],
        capacity: 800,
        simTourists: { normal: 290, weekend: 420, peak: 590, monsoon: 90 },
        tourists: 290,
        alternatives: []
    },
    poovar: {
        id: 'poovar',
        name: 'Poovar Estuary Banks',
        type: 'Estuary/Beach',
        coords: [8.3182, 77.0754],
        capacity: 600,
        simTourists: { normal: 180, weekend: 280, peak: 410, monsoon: 60 },
        tourists: 180,
        alternatives: []
    },
    bekal: {
        id: 'bekal',
        name: 'Bekal Beach Fort',
        type: 'Beach/Fort',
        coords: [12.3892, 75.0315],
        capacity: 1000,
        simTourists: { normal: 420, weekend: 630, peak: 890, monsoon: 130 },
        tourists: 420,
        alternatives: ['kannur']
    },
    kannur: {
        id: 'kannur',
        name: 'Kannur Theyyam Coast',
        type: 'Beach & Culture',
        coords: [11.8745, 75.3704],
        capacity: 800,
        simTourists: { normal: 290, weekend: 420, peak: 590, monsoon: 90 },
        tourists: 290,
        alternatives: ['kizhunna']
    },
    kozhikode: {
        id: 'kozhikode',
        name: 'Kozhikode Calicut Beach',
        type: 'Coastal Port',
        coords: [11.2588, 75.7804],
        capacity: 1200,
        simTourists: { normal: 680, weekend: 950, peak: 1250, monsoon: 210 },
        tourists: 680,
        alternatives: ['kannur', 'kizhunna']
    },
    kizhunna: {
        id: 'kizhunna',
        name: 'Kizhunna Secluded Shores',
        type: 'Beach',
        coords: [11.8152, 75.4338],
        capacity: 500,
        simTourists: { normal: 90, weekend: 140, peak: 210, monsoon: 30 },
        tourists: 90,
        alternatives: []
    },
    shanghumugham: {
        id: 'shanghumugham',
        name: 'Shanghumugham Beach',
        type: 'Beach',
        coords: [8.4802, 76.9131],
        capacity: 800,
        simTourists: { normal: 340, weekend: 520, peak: 710, monsoon: 110 },
        tourists: 340,
        alternatives: []
    },
    trivandrum: {
        id: 'trivandrum',
        name: 'Thiruvananthapuram City',
        type: 'Capital Heritage',
        coords: [8.5241, 76.9366],
        capacity: 1500,
        simTourists: { normal: 820, weekend: 1180, peak: 1450, monsoon: 320 },
        tourists: 820,
        alternatives: ['padmanabhapuram', 'jatayu', 'shanghumugham']
    },
    thrissur: {
        id: 'thrissur',
        name: 'Thrissur Cultural Center',
        type: 'Heritage/Culture',
        coords: [10.5276, 76.2144],
        capacity: 1500,
        simTourists: { normal: 710, weekend: 1050, peak: 1380, monsoon: 240 },
        tourists: 710,
        alternatives: ['guruvayur']
    },
    guruvayur: {
        id: 'guruvayur',
        name: 'Guruvayur Temple Town',
        type: 'Spiritual Center',
        coords: [10.5946, 76.0381],
        capacity: 2000,
        simTourists: { normal: 1150, weekend: 1650, peak: 2100, monsoon: 480 },
        tourists: 1150,
        alternatives: []
    },
    padmanabhapuram: {
        id: 'padmanabhapuram',
        name: 'Padmanabhapuram Palace',
        type: 'Heritage/Palace',
        coords: [8.2504, 77.3274],
        capacity: 700,
        simTourists: { normal: 220, weekend: 340, peak: 490, monsoon: 80 },
        tourists: 220,
        alternatives: []
    },
    jatayu: {
        id: 'jatayu',
        name: 'Jatayu Earth Center',
        type: 'Mythology Park',
        coords: [8.8874, 76.8674],
        capacity: 1200,
        simTourists: { normal: 540, weekend: 820, peak: 1150, monsoon: 180 },
        tourists: 540,
        alternatives: ['padmanabhapuram', 'ponmudi']
    }
};

// State Variables
let currentSelection = 'munnar';
let currentSimProfile = 'normal';
let forecastChartInstance = null;
let capacityChartInstance = null;
let currentRecommendations = [];

// DOM Element Selectors
const destSelector = document.getElementById('destination-selector');
const statusBadge = document.getElementById('dest-status-badge');
const activeTouristsVal = document.getElementById('dest-tourists');
const carryingCapacityVal = document.getElementById('dest-capacity');
const percentageText = document.getElementById('dest-percentage');
const progressBar = document.getElementById('dest-progress-bar');
const routeBtn = document.getElementById('route-btn');
const advisoryAlert = document.getElementById('advisory-alert');
const recommendationsContainer = document.getElementById('recommendations-container');
const feedLog = document.getElementById('feed-log');
const sysStatusText = document.getElementById('system-status-text');
const sysStatusIndicator = document.getElementById('system-status-indicator');

// 2. Initialize Application
window.addEventListener('DOMContentLoaded', () => {
    // Start Clock
    initClock();
    
    // Setup Dropdown Options
    populateDropdown();
    
    // Initialize Map.js
    if (window.initMap) {
        window.initMap();
    }
    
    // Apply default Sim values
    applySimulationProfile('normal');
    
    // Setup Dropdown Event Listener
    destSelector.addEventListener('change', (e) => {
        selectDestination(e.target.value);
    });

    // Setup Route Button
    routeBtn.addEventListener('click', handleRouteRequest);

    // Setup Simulation Trigger Buttons
    document.querySelectorAll('.sim-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const profile = e.currentTarget.getAttribute('data-sim');
            applySimulationProfile(profile);
        });
    });

    // Setup Itinerary Planner UI
    populatePlannerChecklist();
    loadSavedItineraries(); // Load registered itineraries
    document.getElementById('generate-itinerary-btn').addEventListener('click', handleGenerateItinerary);
    document.getElementById('save-itinerary-btn').addEventListener('click', handleSaveItinerary);
    
    // Initial Render of Capacity Bar Chart
    setTimeout(renderCapacityChart, 200);

    logFeed('System Initialization', 'PARAGON Sustainability monitoring online.', 'info');
});

// Dynamic Dropdown populator
function populateDropdown() {
    destSelector.innerHTML = '';
    // Show primary hotspots first, followed by alternates
    const primaryHotspots = ['munnar', 'alappuzha', 'athirappilly', 'kovalam', 'wayanad'];
    
    primaryHotspots.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = destinationsData[key].name;
        destSelector.appendChild(option);
    });
}

// 3. Selection Orchestrator
function selectDestination(id) {
    currentSelection = id;
    destSelector.value = id;
    
    // Clear old map routing lines immediately
    if (window.clearRoute) {
        window.clearRoute();
    }
    routeBtn.classList.remove('active-routing');
    routeBtn.innerHTML = `<i class="fa-solid fa-route"></i> Draw Redirection Path`;

    // Fetch recommendations for this selected location
    getRecommendations(id);

    // Update charts & focus map pin
    updateMetricsUI();
    if (window.focusDestination) {
        window.focusDestination(id);
    }
}

// Expose selectDestination to map marker clicks
window.selectDestination = selectDestination;

// 4. Update UI Dashboard Elements
function updateMetricsUI() {
    const dest = destinationsData[currentSelection];
    if (!dest) return;

    const ratio = dest.tourists / dest.capacity;
    const percentage = Math.round(ratio * 100);

    // Update numerical metrics
    activeTouristsVal.textContent = dest.tourists.toLocaleString();
    carryingCapacityVal.textContent = dest.capacity.toLocaleString();
    percentageText.textContent = `${percentage}%`;

    // Update Progress bar width & color classes
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
    progressBar.className = 'progress-fill'; // Clear colors

    statusBadge.className = 'badge'; // Clear colors

    if (ratio > 0.8) {
        statusBadge.textContent = 'Overloaded';
        statusBadge.classList.add('status-overloaded');
        progressBar.classList.add('progress-fill', 'fill-overloaded');
    } else if (ratio >= 0.5) {
        statusBadge.textContent = 'Moderate';
        statusBadge.classList.add('status-moderate');
        progressBar.classList.add('progress-fill', 'fill-moderate');
    } else {
        statusBadge.textContent = 'Safe';
        statusBadge.classList.add('status-safe');
        progressBar.classList.add('progress-fill', 'fill-safe');
    }

    // Refresh forecasting chart & capacity chart
    renderForecastChart(dest);
    renderCapacityChart();
}

// 5. Query Redirection API (`/api/recommend` with Local Fallback)
function getRecommendations(destId) {
    const dest = destinationsData[destId];
    if (!dest) return;

    const ratio = dest.tourists / dest.capacity;

    // Simulate Network Request to API
    const url = `/api/recommend?destination=${destId}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('API server unavailable - using local fallback engine.');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                renderRecommendations(data.recommendations);
            }
        })
        .catch(err => {
            // High-quality local fallback router (Calculates relative distance and capacity ratios)
            const recs = calculateLocalRecommendations(destId);
            renderRecommendations(recs);
        });
}

// Local recommendation engine matching backend algorithm
function calculateLocalRecommendations(destId) {
    const dest = destinationsData[destId];
    if (!dest || dest.alternatives.length === 0) return [];

    const results = [];
    
    dest.alternatives.forEach(altId => {
        const alt = destinationsData[altId];
        if (!alt) return;

        const ratio = alt.tourists / alt.capacity;
        
        // Mocking distances from congested sites
        let distance = '35 km';
        if (destId === 'munnar') {
            distance = altId === 'vagamon' ? '46 km' : '115 km';
        } else if (destId === 'alappuzha') {
            distance = altId === 'kumarakom' ? '32 km' : '58 km';
        } else if (destId === 'athirappilly') {
            distance = altId === 'vazhachal' ? '7 km' : '38 km';
        } else if (destId === 'kovalam') {
            distance = '42 km'; // Varkala
        }

        results.push({
            id: altId,
            name: alt.name,
            tourists: alt.tourists,
            capacity: alt.capacity,
            ratio: ratio,
            distance: distance
        });
    });

    // Sort by crowd ratio: safest first
    results.sort((a, b) => a.ratio - b.ratio);
    return results;
}

// Render recommendations UI alert cards
function renderRecommendations(recommendations) {
    currentRecommendations = recommendations;
    const dest = destinationsData[currentSelection];
    const ratio = dest.tourists / dest.capacity;

    recommendationsContainer.innerHTML = '';
    advisoryAlert.className = 'advisory-message';

    if (ratio > 0.8) {
        advisoryAlert.classList.add('message-overloaded');
        advisoryAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Critical Warning:</strong> ${dest.name} carrying capacity has been exceeded. Redirection active.`;
        routeBtn.removeAttribute('disabled');
    } else if (ratio >= 0.5) {
        advisoryAlert.classList.add('message-moderate');
        advisoryAlert.innerHTML = `<i class="fa-solid fa-circle-info"></i> <strong>Moderate Load:</strong> ${dest.name} is approaching limits. Pre-emptive rerouting recommended.`;
        routeBtn.removeAttribute('disabled');
    } else {
        advisoryAlert.classList.add('message-safe');
        advisoryAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Optimal Density:</strong> Site load is within threshold limits. No redirection required.`;
        routeBtn.setAttribute('disabled', 'true');
    }

    if (recommendations.length === 0 || ratio < 0.5) {
        recommendationsContainer.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 15px 0;">
                No alternative routing recommended for this density profile.
            </div>
        `;
        return;
    }

    recommendations.forEach(alt => {
        const altPercentage = Math.round(alt.ratio * 100);
        const altStatus = alt.ratio > 0.8 ? 'red' : alt.ratio >= 0.5 ? 'orange' : 'green';
        
        const card = document.createElement('div');
        card.className = 'rec-card';
        card.innerHTML = `
            <div class="rec-info">
                <span class="rec-name">${alt.name}</span>
                <span class="rec-distance"><i class="fa-solid fa-location-arrow"></i> ${alt.distance} away</span>
            </div>
            <div class="rec-status">
                <span class="badge status-${altStatus === 'red' ? 'overloaded' : altStatus === 'orange' ? 'moderate' : 'safe'}">${altPercentage}% load</span>
            </div>
        `;
        
        // Click to view alternative on map
        card.addEventListener('click', () => {
            if (window.focusDestination) {
                window.focusDestination(alt.id);
            }
        });

        recommendationsContainer.innerHTML += card.outerHTML;
    });
}

// 6. Handle Drawing Redirection route
function handleRouteRequest() {
    if (currentRecommendations.length === 0) return;
    
    const isRoutingActive = routeBtn.classList.contains('active-routing');
    
    if (isRoutingActive) {
        // Clear Route
        if (window.clearRoute) window.clearRoute();
        routeBtn.classList.remove('active-routing');
        routeBtn.innerHTML = `<i class="fa-solid fa-route"></i> Draw Redirection Path`;
        logFeed('Routing Cleared', `Removed redirection paths for ${destinationsData[currentSelection].name}.`, 'info');
    } else {
        // Draw Route
        if (window.drawRedirectionRoute) {
            window.drawRedirectionRoute(currentSelection, currentRecommendations);
        }
        routeBtn.classList.add('active-routing');
        routeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Clear Redirection Path`;
        
        const altsNames = currentRecommendations.map(r => r.name).join(', ');
        logFeed('Redirection Route Plotted', `Redirection vector calculated from ${destinationsData[currentSelection].name} to [${altsNames}].`, 'warn');
    }
}

// 7. Paint the 12-Hour Load Forecast Chart (ChartJS)
function renderForecastChart(destination) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    // Generate dynamic 12-hour labels starting from current hour
    const now = new Date();
    const labels = [];
    for (let i = 1; i <= 12; i++) {
        const hour = (now.getHours() + i) % 24;
        labels.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // Generate forecast load numbers with peaks and troughs depending on simulation
    const limit = destination.capacity;
    const currentVal = destination.tourists;
    const forecastData = [];

    // Simple peak shape representing afternoon tourist flow
    for (let i = 1; i <= 12; i++) {
        const hour = (now.getHours() + i) % 24;
        
        let timeFactor = 1.0;
        // Peak hours in tourism: 11:00 to 16:00
        if (hour >= 11 && hour <= 16) {
            timeFactor = 1.25;
        } else if (hour >= 20 || hour <= 6) {
            timeFactor = 0.45; // Nights
        } else {
            timeFactor = 0.85; // Mornings/Evenings
        }

        // Apply slight random noise
        const noise = 0.95 + Math.random() * 0.1;
        const forecastedVal = Math.round(currentVal * timeFactor * noise);
        forecastData.push(forecastedVal);
    }

    // Destroy existing chart to avoid overlay issues on recreate
    if (forecastChartInstance) {
        forecastChartInstance.destroy();
    }

    // Determine color profile based on threshold breach
    const peaksBreached = forecastData.some(val => val > limit);
    const borderColor = peaksBreached ? '#ef4444' : '#0ea5e9';
    const bgGradientColor = peaksBreached ? 'rgba(239, 68, 68, 0.12)' : 'rgba(14, 165, 233, 0.08)';

    // Chart Gradient configurations
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, bgGradientColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    forecastChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Forecasted Visitor Load',
                    data: forecastData,
                    borderColor: borderColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: borderColor,
                    pointBorderColor: 'rgba(255,255,255,0.7)',
                    pointHoverRadius: 6
                },
                {
                    label: 'Carrying Capacity Limit',
                    data: Array(12).fill(limit),
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    labelColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: 'Outfit',
                            size: 10
                        },
                        boxWidth: 15,
                        padding: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    bodyFont: {
                        family: 'Outfit'
                    },
                    titleFont: {
                        family: 'Outfit',
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        drawTicks: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Outfit',
                            size: 9
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Outfit',
                            size: 9
                        }
                    }
                }
            }
        }
    });
}

// 8. Trigger Live Simulation Control Panel
function applySimulationProfile(profile) {
    currentSimProfile = profile;
    
    // Update simulation button active states
    document.querySelectorAll('.sim-trigger').forEach(btn => {
        if (btn.getAttribute('data-sim') === profile) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tourist volumes in all destinations based on profile choice
    Object.keys(destinationsData).forEach(id => {
        destinationsData[id].tourists = destinationsData[id].simTourists[profile];
    });

    // Recalculate system-wide status
    let totalHotspotCapacity = 0;
    let totalHotspotTourists = 0;
    let activeBreachesCount = 0;

    const mainHotspots = ['munnar', 'alappuzha', 'athirappilly', 'kovalam'];
    mainHotspots.forEach(id => {
        const dest = destinationsData[id];
        totalHotspotCapacity += dest.capacity;
        totalHotspotTourists += dest.tourists;
        if (dest.tourists > dest.capacity) {
            activeBreachesCount++;
        }
    });

    const averageLoadFactor = totalHotspotTourists / totalHotspotCapacity;
    
    // Update global system status indicator badges
    if (activeBreachesCount > 1 || averageLoadFactor > 0.85) {
        sysStatusText.textContent = 'Critical (Congestion Alert)';
        sysStatusIndicator.className = 'pulse-indicator status-red';
    } else if (activeBreachesCount === 1 || averageLoadFactor >= 0.6) {
        sysStatusText.textContent = 'Moderate Load';
        sysStatusIndicator.className = 'pulse-indicator status-orange';
    } else {
        sysStatusText.textContent = 'Optimal Flow';
        sysStatusIndicator.className = 'pulse-indicator status-green';
    }

    // Refresh Map Layers
    if (window.updateMapMarkers) {
        window.updateMapMarkers(Object.values(destinationsData), currentSelection);
    }

    // Refresh UI parameters
    selectDestination(currentSelection);

    // Push feed messages
    const profileLabel = profile.charAt(0).toUpperCase() + profile.slice(1);
    logFeed('Simulation Switched', `Active simulation set to '${profileLabel}'. Parameters applied.`, 'info');

    if (activeBreachesCount > 0) {
        logFeed('Capacity Exceeded', `${activeBreachesCount} tourism hotspots are experiencing carrying capacity overloads!`, 'warn');
    }
}

// Helper to push items to the real-time activity ticker
function logFeed(title, text, type = 'info') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    console.log(`[${type.toUpperCase()}] ${title}: ${text}`);

    if (feedLog) {
        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${type === 'warn' ? 'feed-warn' : 'feed-info'}`;
        feedItem.innerHTML = `
            <span class="feed-time">${timeStr}</span>
            <div class="feed-text">
                <strong>${title}:</strong> ${text}
            </div>
        `;

        feedLog.prepend(feedItem); // Put newest items on top
        
        while (feedLog.children.length > 20) {
            feedLog.removeChild(feedLog.lastChild);
        }
    }
}

// 9. Real-Time clock runner
function initClock() {
    const clock = document.getElementById('live-clock');
    const updateTime = () => {
        const d = new Date();
        clock.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// ==========================================
// 10. ITINERARY PLANNER & PERSISTENCE ENGINE
// ==========================================

let generatedItinerarySteps = [];

// // Populate checklist of tourist spots dynamically from all 30 spots
function populatePlannerChecklist() {
    const container = document.getElementById('planner-checklist');
    container.innerHTML = '';
    
    // Sort spots alphabetically for checklist readability
    const sortedSpots = Object.values(destinationsData).sort((a, b) => a.name.localeCompare(b.name));

    sortedSpots.forEach(spot => {
        const item = document.createElement('label');
        item.className = 'checklist-item';
        item.innerHTML = `
            <input type="checkbox" name="planner-spots" value="${spot.id}" checked>
            <span>${spot.name}</span>
        `;
        container.appendChild(item);
    });

    // Default start date to today
    document.getElementById('travel-date').valueAsDate = new Date();
}

// Calculate and generate the timeline
function handleGenerateItinerary() {
    const name = document.getElementById('traveler-name').value.trim();
    const startDateStr = document.getElementById('travel-date').value;
    const duration = parseInt(document.getElementById('travel-days').value);
    const unit = document.getElementById('travel-days-unit').value; // 'days' or 'hours'
    const groupSize = parseInt(document.getElementById('traveler-count').value) || 2;
    
    if (!name) {
        alert("Please enter your name to personalize the itinerary.");
        return;
    }
    if (!startDateStr) {
        alert("Please select a start date.");
        return;
    }

    // Get checked checklist locations
    const checkedCheckboxes = document.querySelectorAll('input[name="planner-spots"]:checked');
    const selectedIds = Array.from(checkedCheckboxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
        alert("Please select at least one place of interest.");
        return;
    }

    const spotGuides = {
        munnar: {
            optimalTime: "07:30 AM - 10:30 AM (for valley mist & low crowds)",
            routeGuide: "Route: Kochi-Madurai Highway (NH85). 3h 45m drive. Watch out for mountain hairpin curves.",
            weatherSafety: "Weather: 16°C - 22°C. Misty and cool. Low landslide threat level today.",
            ecoVoucher: "PARAGON Eco-Voucher: Present this timeline for a 15% discount at Munnar Tea Museum!"
        },
        wayanad: {
            optimalTime: "09:00 AM - 12:00 PM (safest forest viewing window)",
            routeGuide: "Route: Take Ghat highway through Lakkidi Pass. Watch for narrow steep curves.",
            weatherSafety: "Weather: 20°C - 24°C. Forest shade. Mosquito warning; carry organic repellents.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off entry tickets at Edakkal Caves!"
        },
        thekkady: {
            optimalTime: "06:00 AM - 09:00 AM (best for Periyar lake boat safari bird sightings)",
            routeGuide: "Route: KK Road (NH183) via Kanjirappally. Scenic winding valley path.",
            weatherSafety: "Weather: 19°C - 24°C. Deep forests. Watch out for sudden tropical showers.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free eco-bag with local spice packages at forest outlet!"
        },
        vagamon: {
            optimalTime: "02:00 PM - 05:00 PM (perfect stroll weather)",
            routeGuide: "Route: Erattupetta-Vagamon Road. 1h 45m drive from Kottayam. Scenic valleys.",
            weatherSafety: "Weather: 19°C - 23°C. Breezy & cool fog patches. Excellent hiking roads.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 15% off pine forest and meadows entry tickets!"
        },
        ponmudi: {
            optimalTime: "06:00 AM - 09:00 AM (valley sunrise view)",
            routeGuide: "Route: Nedumangad-Ponmudi road. 22 Hairpins. Keep headlights on in fog.",
            weatherSafety: "Weather: 17°C - 21°C. Cold fog. Drive carefully on narrow bends.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 20% off tea at Ponmudi Hilltops Cafe!"
        },
        idukki: {
            optimalTime: "09:30 AM - 01:00 PM (pleasant sunlight for dam walk)",
            routeGuide: "Route: Thodupuzha-Puliyanmala Road. 2h drive. Mountain road.",
            weatherSafety: "Weather: 20°C - 25°C. Clean mountain air. Strict checkpost registration required.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off entry passes at Idukki Hill View Park!"
        },
        nelliampathy: {
            optimalTime: "08:00 AM - 11:30 AM (orange orchard viewing hours)",
            routeGuide: "Route: Nenmara-Nelliampathy Road. 10 hairpins. Winding valley paths.",
            weatherSafety: "Weather: 18°C - 23°C. Cool hillside breeze. Keep vehicle speeds low.",
            ecoVoucher: "PARAGON Eco-Voucher: Claim a free local orange juice voucher at Nelliampathy Farms!"
        },
        silent_valley: {
            optimalTime: "08:00 AM - 01:00 PM (controlled safari slots)",
            routeGuide: "Route: Mannarkkad-Anakkatti Road. Restricted forest access checkpoints.",
            weatherSafety: "Weather: 21°C - 26°C. Heavy forest canopy. Deep silence zones; do not litter or make noise.",
            ecoVoucher: "PARAGON Eco-Voucher: 15% discount on forest department eco-guides!"
        },
        malampuzha: {
            optimalTime: "03:30 PM - 07:00 PM (best evening lighting for dam gardens)",
            routeGuide: "Route: Palakkad bypass roads. Easily accessible via city transit.",
            weatherSafety: "Weather: 27°C - 31°C. Garden conditions. Watch kids near the reservoir banks.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off Malampuzha ropeway tickets!"
        },
        alappuzha: {
            optimalTime: "03:30 PM - 06:30 PM (for comfortable sunset boat cruise)",
            routeGuide: "Route: Travel via NH66 from Kochi. 1h 30m drive. Flat urban highways.",
            weatherSafety: "Weather: 28°C - 32°C. High humidity. Carry water and wear sun block.",
            ecoVoucher: "PARAGON Eco-Voucher: Enjoy a complimentary lunch boat voucher at Vembanad Lake Cafe!"
        },
        kumarakom: {
            optimalTime: "02:00 PM - 05:00 PM (safe bird sanctuary hours)",
            routeGuide: "Route: Kottayam-Cherthala Road. 30 mins drive from Kottayam. Flat scenery.",
            weatherSafety: "Weather: 27°C - 31°C. Moderate swamp humidity. Wear walking shoes.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 15% off at Kumarakom Bird Sanctuary entry!"
        },
        kollam: {
            optimalTime: "09:00 AM - 12:00 PM (morning Ashtamudi lake canal cruises)",
            routeGuide: "Route: NH66 through city center. Heavy local traffic.",
            weatherSafety: "Weather: 28°C - 32°C. Maritime conditions. Always wear safety lifejackets on water.",
            ecoVoucher: "PARAGON Eco-Voucher: Receive a free local cashew snack pack on houseboat boarding!"
        },
        munroe_island: {
            optimalTime: "03:00 PM - 06:00 PM (narrow canal canoe cruises)",
            routeGuide: "Route: Kollam-Munroe Island local roads. Easy train access available.",
            weatherSafety: "Weather: 26°C - 30°C. Swampy environment. Bring insect repellants.",
            ecoVoucher: "PARAGON Eco-Voucher: 15% discount on canoe boating with local fishers!"
        },
        kavvayi: {
            optimalTime: "03:00 PM - 06:30 PM (peaceful northern sunset channels)",
            routeGuide: "Route: Payyanur city roads. 15 mins drive from railway station.",
            weatherSafety: "Weather: 27°C - 31°C. Calm backwaters. Ideal for uncrowded kayaking.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free coconut water drink at Kavvayi village boat stand!"
        },
        ashtamudi: {
            optimalTime: "04:00 PM - 07:00 PM (scenic lakeside views)",
            routeGuide: "Route: Kollam bypass roads. Scenic views over palm shores.",
            weatherSafety: "Weather: 27°C - 30°C. Cool lakeside breeze. Wear hats and sunscreen.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off at Ashtamudi Coir Artisan Guild shops!"
        },
        kovalam: {
            optimalTime: "04:00 PM - 07:00 PM (for relaxing sea breeze)",
            routeGuide: "Route: Take Bypass highway from Trivandrum city. 25 mins drive.",
            weatherSafety: "Weather: 29°C - 33°C. Tropical. Avoid swimming deep due to strong beach rip tides.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off organic items at Kovalam Weavers Cooperative!"
        },
        varkala: {
            optimalTime: "04:30 PM - 06:30 PM (spectacular sunset cliff walk)",
            routeGuide: "Route: NH66 towards Kallambalam. 1h 15m drive from Trivandrum. Narrow local roads.",
            weatherSafety: "Weather: 28°C - 31°C. Warm sea breeze. Cliff edge has loose gravel; stay on path.",
            ecoVoucher: "PARAGON Eco-Voucher: Free organic herbal tea voucher at Cliff Organic Cafe!"
        },
        fort_kochi: {
            optimalTime: "04:00 PM - 07:30 PM (Chinese fishing net walks)",
            routeGuide: "Route: easy street walks. Ferries run from Ernakulam jetty every 20 mins.",
            weatherSafety: "Weather: 29°C - 32°C. Sea breeze. Paved pedestrian paths.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off at Fort Kochi Heritage Craft Cooperative!"
        },
        marari: {
            optimalTime: "06:00 AM - 09:00 AM (peaceful morning coastal walks)",
            routeGuide: "Route: Mararikulam village roads off NH66. Flat lanes.",
            weatherSafety: "Weather: 27°C - 30°C. Clear sandy beach. Sun protective gear recommended.",
            ecoVoucher: "PARAGON Eco-Voucher: Free local shell art souvenir at Marari handicraft hut!"
        },
        poovar: {
            optimalTime: "02:30 PM - 05:30 PM (mangrove forest boat rides)",
            routeGuide: "Route: TVM-Kovalam-Poovar road. 45 mins drive from capital.",
            weatherSafety: "Weather: 28°C - 32°C. High tide warnings in afternoon. Keep hands inside boats.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free fresh fruit bowl at Poovar floating park!"
        },
        bekal: {
            optimalTime: "03:30 PM - 06:30 PM (best fort lighting for photography)",
            routeGuide: "Route: Kanhangad-Kasargod highway. 25 mins drive from Kasargod.",
            weatherSafety: "Weather: 28°C - 31°C. Fort pathways can get warm. Keep hydrated.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off entry tickets at Bekal Historical Fort!"
        },
        kannur: {
            optimalTime: "04:00 PM - 07:30 PM (Theyyam museum & drive-in beaches)",
            routeGuide: "Route: NH66 bypass road. Easily navigable coastal streets.",
            weatherSafety: "Weather: 28°C - 32°C. High humidity. Safe sandy beaches.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free handloom bag at Kannur Weaver cooperative!"
        },
        kozhikode: {
            optimalTime: "04:30 PM - 08:00 PM (famous Kozhikode beach foods walk)",
            routeGuide: "Route: Calicut beach bypass. Dense city traffic in evenings.",
            weatherSafety: "Weather: 28°C - 31°C. Seaside breeze. Crowded parking zones; use public transit.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free Kozhikodan Halwa sample slice at sweet street!"
        },
        kizhunna: {
            optimalTime: "03:00 PM - 06:00 PM (quiet beach picnic)",
            routeGuide: "Route: local coastal paths off Kannur city. Winding sandy lanes.",
            weatherSafety: "Weather: 27°C - 31°C. Secluded. Low crowd, highly safe swimming.",
            ecoVoucher: "PARAGON Eco-Voucher: Receive a free coconut oil bottle sample at village co-op!"
        },
        shanghumugham: {
            optimalTime: "05:00 PM - 07:00 PM (sea giant sculpture & sunset)",
            routeGuide: "Route: Airport Road from Thiruvananthapuram. Multi-lane highway.",
            weatherSafety: "Weather: 27°C - 30°C. Beach erosion risk in monsoon. Stay away from waves.",
            ecoVoucher: "PARAGON Eco-Voucher: 10% off at Coffee House Shanghumugham beach branch!"
        },
        trivandrum: {
            optimalTime: "09:00 AM - 12:30 PM (museums and palace tours)",
            routeGuide: "Route: TVM main roads. Excellent city transit infrastructure.",
            weatherSafety: "Weather: 28°C - 32°C. Pleasant city walks. Comfortable footwear recommended.",
            ecoVoucher: "PARAGON Eco-Voucher: 15% discount on Napier Museum tickets!"
        },
        thrissur: {
            optimalTime: "09:30 AM - 01:00 PM (Vadakkumnathan temple walk)",
            routeGuide: "Route: Swaraj Round. Expect high round-about traffic congestion.",
            weatherSafety: "Weather: 27°C - 32°C. Hot city center. Sun umbrella is useful.",
            ecoVoucher: "PARAGON Eco-Voucher: Get a free traditional brass oil lamp souvenir at town bazaar!"
        },
        guruvayur: {
            optimalTime: "05:00 AM - 08:00 AM (morning spiritual queues)",
            routeGuide: "Route: Thrissur-Guruvayur highway. 45 mins drive. Heavy tourist coaches.",
            weatherSafety: "Weather: 26°C - 30°C. Extremely crowded temple queue complexes. Keep safe distances.",
            ecoVoucher: "PARAGON Eco-Voucher: Free traditional prasad packet at temple trust counters!"
        },
        padmanabhapuram: {
            optimalTime: "09:00 AM - 01:00 PM (wooden palace architecture walk)",
            routeGuide: "Route: Kanyakumari highway (NH66). 1.5h drive from TVM.",
            weatherSafety: "Weather: 29°C - 33°C. Warm. Wooden palace requires walking barefoot inside.",
            ecoVoucher: "PARAGON Eco-Voucher: 10% discount on wooden handicraft purchases!"
        },
        jatayu: {
            optimalTime: "09:00 AM - 01:00 PM (best cable car views & sculpture walks)",
            routeGuide: "Route: MC Road (NH183) near Chadayamangalam. 1h drive from Trivandrum.",
            weatherSafety: "Weather: 25°C - 30°C. Hilltop sun. Cable cars are air-conditioned; wear hats.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off Jatayu cable car family passes!"
        }
    };

    const timelineContainer = document.getElementById('itinerary-timeline');
    const stepsContainer = document.getElementById('timeline-steps');
    stepsContainer.innerHTML = '';
    generatedItinerarySteps = [];

    const startDate = new Date(startDateStr);

    // Schedule: allocate destinations sequentially
    for (let stepIdx = 0; stepIdx < duration; stepIdx++) {
        const baseId = selectedIds[stepIdx % selectedIds.length];
        const dest = destinationsData[baseId];
        if (!dest) continue;

        let isCongested = false;
        let ratio = dest.tourists / dest.capacity;
        let timeLabel = '';
        let predictedLoad = dest.tourists;

        if (unit === 'hours') {
            const now = new Date();
            const currentHour = (now.getHours() + stepIdx) % 24;
            timeLabel = `${currentHour.toString().padStart(2, '0')}:00`;

            let timeFactor = 1.0;
            if (currentHour >= 11 && currentHour <= 16) {
                timeFactor = 1.25;
            } else if (currentHour >= 20 || currentHour <= 6) {
                timeFactor = 0.45;
            } else {
                timeFactor = 0.85;
            }
            predictedLoad = Math.round(dest.tourists * timeFactor) + groupSize;
            ratio = predictedLoad / dest.capacity;
            isCongested = ratio >= 0.8;
        } else {
            const currentStepDate = new Date(startDate);
            currentStepDate.setDate(startDate.getDate() + stepIdx);
            timeLabel = currentStepDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            predictedLoad = dest.tourists + groupSize;
            ratio = predictedLoad / dest.capacity;
            isCongested = ratio >= 0.8;
        }

        let stepClass = 'safe-step';
        let stepName = dest.name;
        let altReason = '';
        let finalDestId = baseId;
        
        if (isCongested) {
            stepClass = 'congested-step';
            const alternatives = calculateLocalRecommendations(baseId);
            if (alternatives.length > 0) {
                const bestAlt = alternatives[0];
                finalDestId = bestAlt.id;
                stepName = `${dest.name} ➔ ${bestAlt.name}`;
                
                altReason = `
                    <div class="step-redirect-alert" style="margin-bottom: 8px;">
                        <strong>Redirection Active:</strong> ${dest.name} exceeds capacity limits at ${timeLabel} (${Math.round(ratio*100)}% load with your group of ${groupSize}). 
                        Rerouted to <strong>${bestAlt.name}</strong> (${bestAlt.distance} away).
                    </div>
                `;
                
                logFeed('Itinerary Redirection', `Rerouted ${unit === 'hours' ? 'Hour ' + (stepIdx+1) : 'Day ' + (stepIdx+1)} from crowded ${dest.name} to ${bestAlt.name}`, 'warn');
            } else {
                altReason = `<div class="step-redirect-alert" style="margin-bottom: 8px;"><strong>Alert:</strong> Area is overloaded at this time. Proceed with caution.</div>`;
            }
        } else {
            logFeed('Itinerary Scheduled', `Scheduled ${unit === 'hours' ? 'Hour ' + (stepIdx+1) : 'Day ' + (stepIdx+1)} to ${dest.name} (Optimal)`, 'info');
        }

        generatedItinerarySteps.push({
            day: stepIdx + 1,
            date: timeLabel,
            destination_id: finalDestId,
            destination_name: stepName,
            status: isCongested ? "Redirected" : "Safe"
        });

        // Get details
        const details = spotGuides[finalDestId] || {
            optimalTime: "09:00 AM - 12:00 PM",
            routeGuide: "Route: Local roads. Drive safely.",
            weatherSafety: "Weather: 25°C. Pleasant skies.",
            ecoVoucher: "PARAGON Eco-Voucher: Support local craft vendors at destination!"
        };

        const stepCard = document.createElement('div');
        stepCard.className = `timeline-step ${stepClass}`;
        stepCard.style.cursor = 'pointer';
        stepCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <span class="step-day-badge">${unit === 'hours' ? 'Hour ' + (stepIdx + 1) + ' (' + timeLabel + ')' : 'Day ' + (stepIdx + 1) + ' - ' + timeLabel}</span>
                <span class="badge ${isCongested ? 'status-overloaded' : 'status-safe'}">${isCongested ? 'Redirected' : 'Safe density'}</span>
            </div>
            <span class="step-name" style="font-size: 0.95rem; font-weight: 700; margin-bottom: 5px; display: block;">${stepName}</span>
            ${altReason}
            <div style="margin-top: 8px; font-size: 0.78rem; display: grid; grid-template-columns: 1fr; gap: 6px; border-top: 1px solid var(--card-border); padding-top: 8px;">
                <div><i class="fa-regular fa-clock" style="color: var(--color-accent);"></i> <strong>Best Slot:</strong> ${details.optimalTime}</div>
                <div><i class="fa-solid fa-map-pin" style="color: var(--color-accent);"></i> <strong>Travel Guide:</strong> ${details.routeGuide}</div>
                <div><i class="fa-solid fa-cloud-sun" style="color: var(--color-accent);"></i> <strong>Safety & Weather:</strong> ${details.weatherSafety}</div>
                <div style="color: var(--color-primary); font-weight: 600;"><i class="fa-solid fa-gift"></i> <strong>Eco Artisan Reward:</strong> ${details.ecoVoucher}</div>
            </div>
        `;

        stepCard.addEventListener('click', () => {
            if (window.selectDestination) {
                window.selectDestination(finalDestId);
            }
        });

        stepsContainer.appendChild(stepCard);
    }

    timelineContainer.classList.remove('hidden');
}

// Save the itinerary in the database via POST /api/itineraries
function handleSaveItinerary() {
    const name = document.getElementById('traveler-name').value.trim();
    const startDateStr = document.getElementById('travel-date').value;
    const unit = document.getElementById('travel-days-unit').value;
    
    if (generatedItinerarySteps.length === 0) return;

    // Create string list of destinations
    const listStr = generatedItinerarySteps.map(s => `${unit === 'hours' ? 'Hr' : 'Day'} ${s.day}: ${s.destination_name}`).join(" | ");

    const payload = {
        traveler_name: name,
        travel_date: startDateStr,
        destinations_list: listStr
    };

    fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error('Database server offline.');
        return response.json();
    })
    .then(data => {
        logFeed('Route Registered', `Itinerary successfully saved to SQLite DB (ID: ${data.id})`, 'info');
        alert(`Success! Your custom crowd-safe itinerary has been saved to the database.\nItinerary ID: ${data.id}`);
        loadSavedItineraries(); // Refresh list immediately!
    })
    .catch(err => {
        console.error("Save failed:", err);
        logFeed('Save Error', 'Failed to persist itinerary. Backend SQLite offline.', 'warn');
        alert("Failed to save to database. Please make sure the FastAPI server is running.");
    });
}

// Fetch and display registered itineraries from DB
function loadSavedItineraries() {
    const container = document.getElementById('itinerary-registry-container');
    if (!container) return;

    fetch('/api/itineraries')
    .then(response => {
        if (!response.ok) throw new Error('API server offline.');
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            container.innerHTML = `
                <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 15px 0;">
                    No registered travel plans found.
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        data.forEach(itin => {
            // Parse created timestamp nicely
            const createdDate = new Date(itin.created_at);
            const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = createdDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

            const item = document.createElement('div');
            item.className = 'registry-item';
            item.title = "Click to focus route on map";
            item.innerHTML = `
                <div class="registry-title">
                    <span>${itin.traveler_name}</span>
                    <span class="registry-date">${timeStr} (${dateStr})</span>
                </div>
                <div class="registry-details">
                    <i class="fa-solid fa-route"></i> ${itin.destinations_list}
                </div>
            `;

            // Click registered item to parse and select the first destination on the map!
            item.addEventListener('click', () => {
                logFeed('Registry Focus', `Viewing registered route for ${itin.traveler_name}`, 'info');
                // Extract first route destination
                const match = itin.destinations_list.match(/(?:Day|Hr|Day 1|Hr 1|Day|Hr)\s*\d*:\s*([^➔|]+)/);
                if (match && match[1]) {
                    const spotName = match[1].trim();
                    // Match to local destinations keys
                    const matchedKey = Object.keys(destinationsData).find(key => 
                        destinationsData[key].name.toLowerCase().includes(spotName.toLowerCase()) || 
                        spotName.toLowerCase().includes(destinationsData[key].name.toLowerCase())
                    );
                    if (matchedKey) {
                        selectDestination(matchedKey);
                    }
                }
            });

            container.appendChild(item);
        });
    })
    .catch(err => {
        console.error("Registry fetch error:", err);
        container.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--color-overloaded); text-align: center; padding: 15px 0;">
                Database syncing is offline.
            </div>
        `;
    });
}

// Render capacity bar chart comparing active loads across all major hotspots
function renderCapacityChart() {
    const canvas = document.getElementById('capacityChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Sort destinations to display consistent order
    const spots = Object.values(destinationsData).filter(s => 
        ['munnar', 'alappuzha', 'athirappilly', 'kovalam', 'wayanad'].includes(s.id)
    );
    
    const labels = spots.map(s => s.name.replace(" Hill Station", "").replace(" Backwaters", "").replace(" Waterfalls", "").replace(" Ecotourism", "").replace(" Beach", ""));
    const data = spots.map(s => Math.round((s.tourists / s.capacity) * 100));

    // Colors mapping slate styles
    const colors = spots.map(s => {
        const ratio = s.tourists / s.capacity;
        if (ratio > 0.8) return '#ef4444'; // Red
        if (ratio >= 0.5) return '#fb923c'; // Pastel Peach
        return '#10b981'; // Pastel Green
    });

    if (capacityChartInstance) {
        capacityChartInstance.destroy();
    }

    capacityChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Load Factor (%)',
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => ` Load Factor: ${context.raw}%`
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#0f172a', font: { family: 'Outfit', size: 9, weight: '600' } }
                }
            }
        }
    });
}

