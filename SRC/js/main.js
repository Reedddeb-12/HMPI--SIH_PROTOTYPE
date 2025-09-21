// Simple Main JS - No Animations, Fast Performance
// Global variables
let map;
let markers = [];
let waterQualityData = [];
let chartInstances = {};

// Initialize application - simple and fast
document.addEventListener('DOMContentLoaded', function() {
    initializeBasicComponents();
    
    // Set today's date
    const dateInput = document.getElementById('sample-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
});

// Initialize only essential components
function initializeBasicComponents() {
    initializeEventListeners();
    
    // Initialize map after a short delay
    setTimeout(initializeMap, 100);
    
    // Initialize charts after map
    setTimeout(initializeCharts, 200);
    
    // Initialize ML model if available
    setTimeout(initializeMLModel, 300);
    
    // Set static counter values (no animation)
    setStaticCounters();
}

// Set static counter values without animation
function setStaticCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        if (target) {
            counter.textContent = target;
        }
    });
}

// Simple tab switching - no animations
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Find and activate the clicked tab button
    if (event && event.target) {
        const activeButton = event.target.closest('.tab');
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    // Handle map resize
    if (tabName === 'mapping' && map) {
        setTimeout(() => {
            map.invalidateSize();
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }, 50);
    }
    
    // Update charts when analytics tab is shown
    if (tabName === 'analytics') {
        setTimeout(updateCharts, 50);
    }
}

// Simple event listeners
function initializeEventListeners() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-upload');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
}

// Simple map initialization
function initializeMap() {
    if (typeof L === 'undefined') {
        setTimeout(initializeMap, 200);
        return;
    }
    
    try {
        map = L.map('map').setView([20.5937, 78.9629], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        map.on('click', function(e) {
            const latInput = document.getElementById('latitude');
            const lngInput = document.getElementById('longitude');
            if (latInput && lngInput) {
                latInput.value = e.latlng.lat.toFixed(6);
                lngInput.value = e.latlng.lng.toFixed(6);
                showNotification('Location selected from map!', 'success');
            }
        });
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Simple charts initialization
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        setTimeout(initializeCharts, 200);
        return;
    }
    
    try {
        const trendsCtx = document.getElementById('trendsChart');
        const distCtx = document.getElementById('distributionChart');
        
        if (trendsCtx) {
            chartInstances.trends = new Chart(trendsCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        label: 'Average HPI',
                        data: [0],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    animation: false, // Disable animations
                    plugins: {
                        title: { display: true, text: 'Monthly Pollution Trends' }
                    }
                }
            });
        }
        
        if (distCtx) {
            chartInstances.distribution = new Chart(distCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#95a5a6']
                    }]
                },
                options: {
                    responsive: true,
                    animation: false, // Disable animations
                    plugins: {
                        title: { display: true, text: 'Heavy Metal Distribution' }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Simple ML model initialization
function initializeMLModel() {
    const statusElement = document.getElementById('ml-status');
    const predictButton = document.getElementById('predict-btn');
    
    if (!statusElement || !predictButton) return;
    
    if (typeof tf === 'undefined') {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Using fallback prediction method.';
        statusElement.className = 'alert alert-error';
    } else {
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> ML Model ready.';
        statusElement.className = 'alert alert-success';
    }
    
    predictButton.disabled = false;
}

// Simple notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.simple-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'simple-notification';
    notification.innerHTML = `
        ${message}
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; margin-left: 10px;">×</button>
    `;
    
    // Simple styling
    const bgColor = type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#667eea';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        background: ${bgColor};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// File handling functions
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#667eea';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Simple file processing
function processFile(file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('File too large. Please use files under 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.csv')) {
                parseCSV(e.target.result);
            } else {
                showNotification('Please upload a CSV file', 'error');
            }
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Simple CSV parsing
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showNotification('CSV file must contain header and data rows', 'error');
        return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredFields = ['location', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
        showNotification(`Missing required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    let processedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0]) {
            const data = {};
            headers.forEach((header, index) => {
                data[header] = values[index] || '';
            });
            
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            
            if (isNaN(lat) || isNaN(lng)) continue;
            
            const newData = {
                location: data.location,
                latitude: lat,
                longitude: lng,
                date: data.date || new Date().toISOString().split('T')[0],
                metals: {
                    lead: parseFloat(data.lead) || 0,
                    mercury: parseFloat(data.mercury) || 0,
                    cadmium: parseFloat(data.cadmium) || 0,
                    arsenic: parseFloat(data.arsenic) || 0,
                    chromium: parseFloat(data.chromium) || 0,
                    copper: parseFloat(data.copper) || 0,
                    zinc: parseFloat(data.zinc) || 0,
                    nickel: parseFloat(data.nickel) || 0
                }
            };
            
            newData.indices = {
                hpi: calculateHPI(newData.metals),
                hei: calculateHEI(newData.metals),
                cd: calculateContaminationDegree(newData.metals)
            };
            
            waterQualityData.push(newData);
            processedCount++;
        }
    }
    
    if (processedCount > 0) {
        showNotification(`Successfully imported ${processedCount} records`, 'success');
        updateMapMarkers();
        updateLeaderboards();
        updateLocationTable();
    } else {
        showNotification('No valid data found in CSV file', 'error');
    }
}

// Simple validation
function validateFormData() {
    const location = document.getElementById('location-name')?.value?.trim();
    const lat = document.getElementById('latitude')?.value;
    const lng = document.getElementById('longitude')?.value;
    
    if (!location) {
        showNotification('Please enter a location name', 'error');
        return false;
    }
    
    if (!lat || !lng) {
        showNotification('Please provide coordinates', 'error');
        return false;
    }
    
    const metalIds = ['lead', 'mercury', 'cadmium', 'arsenic', 'chromium', 'copper', 'zinc', 'nickel'];
    const hasData = metalIds.some(id => {
        const element = document.getElementById(id);
        const value = parseFloat(element?.value);
        return !isNaN(value) && value > 0;
    });
    
    if (!hasData) {
        showNotification('Please enter at least one metal concentration', 'error');
        return false;
    }
    
    return true;
}

// Load demo data function
function loadDemoData() {
    const demoData = [
        {
            location: 'Mumbai Industrial Zone',
            latitude: 19.0760,
            longitude: 72.8777,
            date: '2024-01-15',
            metals: {
                lead: 0.015, mercury: 0.008, cadmium: 0.004, arsenic: 0.018,
                chromium: 0.045, copper: 0.25, zinc: 1.2, nickel: 0.08
            }
        },
        {
            location: 'Bangalore Tech Park',
            latitude: 12.9716,
            longitude: 77.5946,
            date: '2024-01-16',
            metals: {
                lead: 0.008, mercury: 0.003, cadmium: 0.002, arsenic: 0.012,
                chromium: 0.025, copper: 0.15, zinc: 0.8, nickel: 0.04
            }
        },
        {
            location: 'Delhi NCR Sample',
            latitude: 28.7041,
            longitude: 77.1025,
            date: '2024-01-17',
            metals: {
                lead: 0.022, mercury: 0.012, cadmium: 0.006, arsenic: 0.025,
                chromium: 0.065, copper: 0.35, zinc: 1.8, nickel: 0.12
            }
        }
    ];
    
    demoData.forEach(data => {
        data.indices = {
            hpi: calculateHPI(data.metals),
            hei: calculateHEI(data.metals),
            cd: calculateContaminationDegree(data.metals)
        };
        waterQualityData.push(data);
    });
    
    updateMapMarkers();
    updateLeaderboards();
    updateLocationTable();
    
    showNotification('Demo data loaded successfully! 3 sample locations added.', 'success');
    setTimeout(() => showTab('mapping'), 500);
}

// Calculate indices function - moved here for completeness
function calculateIndices() {
    if (!validateFormData()) return;
    
    const metals = {
        lead: parseFloat(document.getElementById('lead').value) || 0,
        mercury: parseFloat(document.getElementById('mercury').value) || 0,
        cadmium: parseFloat(document.getElementById('cadmium').value) || 0,
        arsenic: parseFloat(document.getElementById('arsenic').value) || 0,
        chromium: parseFloat(document.getElementById('chromium').value) || 0,
        copper: parseFloat(document.getElementById('copper').value) || 0,
        zinc: parseFloat(document.getElementById('zinc').value) || 0,
        nickel: parseFloat(document.getElementById('nickel').value) || 0
    };
    
    const location = document.getElementById('location-name').value;
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    const date = document.getElementById('sample-date').value;
    
    const hpi = calculateHPI(metals);
    const hei = calculateHEI(metals);
    const cd = calculateContaminationDegree(metals);
    
    displayResults(hpi, hei, cd);
    
    const newData = {
        location: location,
        latitude: lat,
        longitude: lng,
        date: date,
        metals: metals,
        indices: { hpi, hei, cd }
    };
    
    waterQualityData.push(newData);
    updateMapMarkers();
    updateLeaderboards();
    updateLocationTable();
    
    showNotification('Pollution indices calculated successfully!', 'success');
}

// Display results function
function displayResults(hpi, hei, cd) {
    document.getElementById('hpi-value').textContent = hpi;
    document.getElementById('hei-value').textContent = hei;
    document.getElementById('cd-value').textContent = cd;
    
    const hpiStatus = getWaterQualityStatus(parseFloat(hpi));
    document.getElementById('hpi-status').textContent = hpiStatus.text;
    document.getElementById('hpi-status').className = `result-status ${hpiStatus.class}`;
    
    const heiStatus = hei < 10 ? 'Acceptable' : hei < 20 ? 'Moderate' : 'High';
    document.getElementById('hei-status').textContent = heiStatus;
    document.getElementById('hei-status').className = `result-status ${heiStatus.toLowerCase() === 'acceptable' ? 'status-excellent' : 
        heiStatus.toLowerCase() === 'moderate' ? 'status-good' : 'status-poor'}`;
    
    const cdStatus = cd < 5 ? 'Low' : cd < 10 ? 'Moderate' : 'High';
    document.getElementById('cd-status').textContent = cdStatus + ' Contamination';
    document.getElementById('cd-status').className = `result-status ${cdStatus.toLowerCase() === 'low' ? 'status-excellent' : 
        cdStatus.toLowerCase() === 'moderate' ? 'status-good' : 'status-poor'}`;
    
    document.getElementById('results').style.display = 'block';
}

// Water quality status function
function getWaterQualityStatus(hpi) {
    if (hpi < 15) return { text: 'Excellent', class: 'status-excellent' };
    if (hpi < 30) return { text: 'Good', class: 'status-good' };
    if (hpi < 45) return { text: 'Poor', class: 'status-poor' };
    return { text: 'Very Poor', class: 'status-very-poor' };
}

// Clear form function
function clearForm() {
    const inputs = ['location-name', 'latitude', 'longitude', 'lead', 'mercury', 'cadmium', 'arsenic', 'chromium', 'copper', 'zinc', 'nickel'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    const results = document.getElementById('results');
    if (results) results.style.display = 'none';
    
    showNotification('Form cleared successfully', 'info');
}

// Download template function
function downloadTemplate() {
    const csvContent = "location,latitude,longitude,date,lead,mercury,cadmium,arsenic,chromium,copper,zinc,nickel\n" +
        "Sample Location 1,18.5204,73.8567,2024-01-15,0.005,0.002,0.001,0.008,0.02,0.1,0.5,0.03\n" +
        "Sample Location 2,19.0760,72.8777,2024-01-16,0.012,0.004,0.002,0.015,0.03,0.15,0.8,0.05";
        
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hmpi_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Export global functions
window.showTab = showTab;
window.showNotification = showNotification;
window.loadDemoData = loadDemoData;
window.calculateIndices = calculateIndices;
window.clearForm = clearForm;
window.downloadTemplate = downloadTemplate;

