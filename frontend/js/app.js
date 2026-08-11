// app.js - Dashboard Controller, Chart Manager, and Simulation Engine

// 1. Core State Management: Kerala Tourist Hotspots & Alternatives
const destinationsData = {
    munnar: {
        id: 'munnar',
        name: 'Munnar Hill Station',
        type: 'Hill Station',
        coords: [10.0889, 77.0595],
        capacity: 1200,
        simTourists: {
            normal: 720,
            weekend: 1050,
            peak: 1480,
            monsoon: 240
        },
        tourists: 720, // Current visitor count (updated dynamically)
        alternatives: ['vagamon', 'ponmudi']
    },
    alappuzha: {
        id: 'alappuzha',
        name: 'Alappuzha Backwaters',
        type: 'Backwater Tourism',
        coords: [9.4981, 76.3388],
        capacity: 900,
        simTourists: {
            normal: 580,
            weekend: 820,
            peak: 1050,
            monsoon: 180
        },
        tourists: 580,
        alternatives: ['kumarakom', 'fort_kochi']
    },
    athirappilly: {
        id: 'athirappilly',
        name: 'Athirappilly Waterfalls',
        type: 'Nature/Waterfall',
        coords: [10.2851, 76.5413],
        capacity: 1500,
        simTourists: {
            normal: 850,
            weekend: 1350,
            peak: 1650,
            monsoon: 520
        },
        tourists: 850,
        alternatives: ['vazhachal', 'malakkappara']
    },
    kovalam: {
        id: 'kovalam',
        name: 'Kovalam Beach',
        type: 'Beach Hotspot',
        coords: [8.4004, 76.9787],
        capacity: 1000,
        simTourists: {
            normal: 610,
            weekend: 850,
            peak: 1100,
            monsoon: 210
        },
        tourists: 610,
        alternatives: ['varkala']
    },
    wayanad: {
        id: 'wayanad',
        name: 'Wayanad Wildlife Park',
        type: 'Ecotourism',
        coords: [11.6267, 76.2163],
        capacity: 800,
        simTourists: {
            normal: 380,
            weekend: 540,
            peak: 720,
            monsoon: 120
        },
        tourists: 380,
        alternatives: [] // Serving as stable low-density destination
    },
    vagamon: {
        id: 'vagamon',
        name: 'Vagamon Meadows',
        type: 'Eco-Hill Station',
        coords: [9.6908, 76.9048],
        capacity: 1000,
        simTourists: {
            normal: 290,
            weekend: 380,
            peak: 490,
            monsoon: 90
        },
        tourists: 290,
        alternatives: []
    },
    ponmudi: {
        id: 'ponmudi',
        name: 'Ponmudi Hills',
        type: 'Hill Station',
        coords: [8.7602, 77.1166],
        capacity: 600,
        simTourists: {
            normal: 140,
            weekend: 210,
            peak: 310,
            monsoon: 50
        },
        tourists: 140,
        alternatives: []
    },
    kumarakom: {
        id: 'kumarakom',
        name: 'Kumarakom Village',
        type: 'Backwaters',
        coords: [9.5931, 76.4225],
        capacity: 800,
        simTourists: {
            normal: 280,
            weekend: 390,
            peak: 490,
            monsoon: 110
        },
        tourists: 280,
        alternatives: []
    },
    fort_kochi: {
        id: 'fort_kochi',
        name: 'Fort Kochi Heritage',
        type: 'Historical Heritage',
        coords: [9.9627, 76.2427],
        capacity: 1500,
        simTourists: {
            normal: 580,
            weekend: 800,
            peak: 980,
            monsoon: 220
        },
        tourists: 580,
        alternatives: []
    },
    vazhachal: {
        id: 'vazhachal',
        name: 'Vazhachal Falls Area',
        type: 'Waterfall/Forest',
        coords: [10.2989, 76.5684],
        capacity: 800,
        simTourists: {
            normal: 210,
            weekend: 320,
            peak: 450,
            monsoon: 130
        },
        tourists: 210,
        alternatives: []
    },
    malakkappara: {
        id: 'malakkappara',
        name: 'Malakkappara Tea Valleys',
        type: 'Eco-Valley',
        coords: [10.2783, 76.8436],
        capacity: 500,
        simTourists: {
            normal: 110,
            weekend: 160,
            peak: 240,
            monsoon: 40
        },
        tourists: 110,
        alternatives: []
    },
    varkala: {
        id: 'varkala',
        name: 'Varkala Beach Cliff',
        type: 'Coastal Beach',
        coords: [8.7303, 76.7077],
        capacity: 1100,
        simTourists: {
            normal: 420,
            weekend: 590,
            peak: 750,
            monsoon: 150
        },
        tourists: 420,
        alternatives: []
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
    
    const feedItem = document.createElement('div');
    feedItem.className = `feed-item ${type === 'warn' ? 'feed-warn' : 'feed-info'}`;
    feedItem.innerHTML = `
        <span class="feed-time">${timeStr}</span>
        <div class="feed-text">
            <strong>${title}:</strong> ${text}
        </div>
    `;

    feedLog.prepend(feedItem); // Put newest items on top
    
    // Prevent memory leaks / UI bloat by maintaining max 20 entries
    while (feedLog.children.length > 20) {
        feedLog.removeChild(feedLog.lastChild);
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

// Populate checklist of tourist spots
function populatePlannerChecklist() {
    const container = document.getElementById('planner-checklist');
    container.innerHTML = '';
    
    const spots = [
        { id: 'munnar', name: 'Munnar Hill Station' },
        { id: 'alappuzha', name: 'Alappuzha Backwaters' },
        { id: 'athirappilly', name: 'Athirappilly Waterfalls' },
        { id: 'kovalam', name: 'Kovalam Beach' },
        { id: 'wayanad', name: 'Wayanad Ecotourism' }
    ];

    spots.forEach(spot => {
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
        alappuzha: {
            optimalTime: "03:30 PM - 06:30 PM (for comfortable sunset boat cruise)",
            routeGuide: "Route: Travel via NH66 from Kochi. 1h 30m drive. Flat urban highways.",
            weatherSafety: "Weather: 28°C - 32°C. High humidity. Carry water and wear sun block.",
            ecoVoucher: "PARAGON Eco-Voucher: Enjoy a complimentary lunch boat voucher at Vembanad Lake Cafe!"
        },
        athirappilly: {
            optimalTime: "08:00 AM - 11:00 AM (for pristine mist photography and low crowds)",
            routeGuide: "Route: Chalakudy-Anamala Road. 1h 15m drive. Forest canopy road.",
            weatherSafety: "Weather: 26°C - 30°C. Mist spray. Avoid walking on slippery wet rocks near falls.",
            ecoVoucher: "PARAGON Eco-Voucher: Claim a free eco-packaged drinking water bottle at forest entry!"
        },
        kovalam: {
            optimalTime: "04:00 PM - 07:00 PM (for relaxing sea breeze)",
            routeGuide: "Route: Take Bypass highway from Trivandrum city. 25 mins drive.",
            weatherSafety: "Weather: 29°C - 33°C. Tropical. Avoid swimming deep due to strong beach rip tides.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off organic items at Kovalam Weavers Cooperative!"
        },
        wayanad: {
            optimalTime: "09:00 AM - 12:00 PM (safest forest viewing window)",
            routeGuide: "Route: Take Ghat highway through Lakkidi Pass. Watch for narrow steep curves.",
            weatherSafety: "Weather: 20°C - 24°C. Forest shade. Mosquito warning; carry organic repellents.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off entry tickets at Edakkal Caves!"
        },
        vagamon: {
            optimalTime: "02:00 PM - 05:00 PM (perfect stroll weather)",
            routeGuide: "Route: Erattupetta-Vagamon Road. 1h 45m drive from Kottayam. Scenic valleys.",
            weatherSafety: "Weather: 19°C - 23°C. Breezy & cool fog patches. Excellent hiking roads.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 15% off pine forest and meadows entry tickets!"
        },
        varkala: {
            optimalTime: "04:30 PM - 06:30 PM (spectacular sunset cliff walk)",
            routeGuide: "Route: NH66 towards Kallambalam. 1h 15m drive from Trivandrum. Narrow local roads.",
            weatherSafety: "Weather: 28°C - 31°C. Warm sea breeze. Cliff edge has loose gravel; stay on path.",
            ecoVoucher: "PARAGON Eco-Voucher: Free organic herbal tea voucher at Cliff Organic Cafe!"
        },
        ponmudi: {
            optimalTime: "06:00 AM - 09:00 AM (valley sunrise view)",
            routeGuide: "Route: Nedumangad-Ponmudi road. 22 Hairpins. Keep headlights on in fog.",
            weatherSafety: "Weather: 17°C - 21°C. Cold fog. Drive carefully on narrow bends.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 20% off tea at Ponmudi Hilltops Cafe!"
        },
        kumarakom: {
            optimalTime: "02:00 PM - 05:00 PM (safe bird sanctuary hours)",
            routeGuide: "Route: Kottayam-Cherthala Road. 30 mins drive from Kottayam. Flat scenery.",
            weatherSafety: "Weather: 27°C - 31°C. Moderate swamp humidity. Wear walking shoes.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 15% off at Kumarakom Bird Sanctuary entry!"
        },
        fort_kochi: {
            optimalTime: "04:00 PM - 07:30 PM (Chinese fishing net walks)",
            routeGuide: "Route: easy street walks. Ferries run from Ernakulam jetty every 20 mins.",
            weatherSafety: "Weather: 29°C - 32°C. Sea breeze. Paved pedestrian paths.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off at Fort Kochi Heritage Craft Cooperative!"
        },
        vazhachal: {
            optimalTime: "09:00 AM - 12:00 PM (forest bird watching)",
            routeGuide: "Route: Chalakudy-Anamala Road. 5km ahead of Athirappilly. Forest drive.",
            weatherSafety: "Weather: 25°C - 29°C. Deep shade. Safe walkways.",
            ecoVoucher: "PARAGON Eco-Voucher: Get 10% off honey at Vazhachal tribal cooperative!"
        },
        malakkappara: {
            optimalTime: "08:00 AM - 01:00 PM (deep forest sanctuary experience)",
            routeGuide: "Route: Chalakudy-Valparai route. Checkpost permit needed. Watch for elephants.",
            weatherSafety: "Weather: 18°C - 23°C. Clean mountain air. Strict zero-plastic zone.",
            ecoVoucher: "PARAGON Eco-Voucher: Free local spices package from tribal cooperative!"
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
                
                logFeed('Itinerary Redirection', `Rerouted ${unit === 'hours' ? 'Hour ' + (stepIdx+1) : 'Day ' + (stepIdx+1)} from congested ${dest.name} to ${bestAlt.name}`, 'warn');
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
        if (ratio > 0.8) return '#dc2626'; // Overloaded Red
        if (ratio >= 0.5) return '#d97706'; // Moderate Amber
        return '#16a34a'; // Safe Green
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

