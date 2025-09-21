// Optimized Main JS - Performance Enhanced Version
// Global variables
let map;
let markers = [];
let waterQualityData = [];
let chartInstances = {};
let isInitialized = false;

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll/resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize application with performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    
    // Use requestAnimationFrame for smooth initialization
    requestAnimationFrame(() => {
        initializeCore();
        isInitialized = true;
    });
});

// Core initialization - only essential components
function initializeCore() {
    // Initialize in order of importance
    initializeEventListeners();
    
    // Defer heavy operations
    setTimeout(initializeMap, 100);
    setTimeout(initializeCharts, 200);
    setTimeout(() => {
        if (typeof tf !== 'undefined') {
            initializeMLModel();
        }
    }, 500);
    
    // Set today's date
    const dateInput = document.getElementById('sample-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    
    // Initialize lightweight animations only
    initializeLightAnimations();
}

// Lightweight animations - remove heavy ones
function initializeLightAnimations() {
    // Simple counter animation without heavy DOM operations
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
}

// Optimized counter animation
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target')) || 0;
    const duration = 1000;
    const start = Date.now();
    
    function update() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        counter.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Optimized tab management
const debouncedShowTab = debounce(function(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab');
    
    // Use DocumentFragment for batch DOM updates
    tabs.forEach(tab => {
        if (tab.id === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Find and activate the clicked tab
    const activeButton = event?.target?.closest('.tab');
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Handle map resize only when needed
    if (tabName === 'mapping' && map) {
        setTimeout(() => {
            map.invalidateSize();
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }, 100);
    }
    
    // Update charts only when analytics tab is shown
    if (tabName === 'analytics') {
        setTimeout(updateCharts, 100);
    }
}, 100);

function showTab(tabName) {
    debouncedShowTab(tabName);
}

// Optimized event listeners
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
    
    // Throttle window resize events
    window.addEventListener('resize', throttle(() => {
        if (map) {
            map.invalidateSize();
        }
        Object.values(chartInstances).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }, 250));
}

// Optimized map initialization - lazy load
function initializeMap() {
    if (typeof L === 'undefined') {
        console.warn('Leaflet not loaded, retrying...');
        setTimeout(initializeMap, 500);
        return;
    }
    
    try {
        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView([20.5937, 78.9629], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        // Add zoom control in bottom right
        L.control.zoom({
            position: 'bottomright'
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

// Optimized charts initialization
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, retrying...');
        setTimeout(initializeCharts, 500);
        return;
    }
    
    try {
        const trendsCtx = document.getElementById('trendsChart');
        const distCtx = document.getElementById('distributionChart');
        
        if (!trendsCtx || !distCtx) return;
        
        // Simplified chart configuration for better performance
        chartInstances.trends = new Chart(trendsCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['No Data'],
                datasets: [{
                    label: 'Average HPI',
                    data: [0],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 300 // Reduce animation time
                },
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Monthly Pollution Trends'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
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
                maintainAspectRatio: false,
                animation: {
                    duration: 300
                },
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Heavy Metal Distribution' 
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Optimized ML model initialization
function initializeMLModel() {
    const statusElement = document.getElementById('ml-status');
    const predictButton = document.getElementById('predict-btn');
    
    if (!statusElement || !predictButton) return;
    
    if (typeof tf === 'undefined') {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> TensorFlow.js not loaded. Using fallback method.';
        statusElement.className = 'alert alert-error';
        predictButton.disabled = false;
        return;
    }
    
    statusElement.innerHTML = '<i class="fas fa-info-circle"></i> ML Model ready. Using optimized prediction.';
    statusElement.className = 'alert alert-success';
    predictButton.disabled = false;
}

// Simplified notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Simple styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#667eea'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Optimized file handling
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

// Simplified file processing
function processFile(file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('File too large. Please use files under 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.csv')) {
                parseCSVOptimized(e.target.result);
            } else {
                showNotification('Please upload a CSV file', 'error');
            }
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Optimized CSV parsing
function parseCSVOptimized(csvText) {
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
    const batchSize = 100; // Process in batches
    
    function processBatch(startIndex) {
        const endIndex = Math.min(startIndex + batchSize, lines.length);
        
        for (let i = startIndex; i < endIndex; i++) {
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
        
        if (endIndex < lines.length) {
            // Continue processing next batch
            setTimeout(() => processBatch(endIndex), 0);
        } else {
            // Finished processing
            if (processedCount > 0) {
                showNotification(`Successfully imported ${processedCount} records`, 'success');
                // Batch update UI
                requestAnimationFrame(() => {
                    updateMapMarkers();
                    updateLeaderboards();
                    updateLocationTable();
                });
            } else {
                showNotification('No valid data found in CSV file', 'error');
            }
        }
    }
    
    processBatch(1);
}

// Optimized validation
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
    
    // Quick check for any metal data
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

// Export optimized functions
window.showTab = showTab;
window.showNotification = showNotification;

 



