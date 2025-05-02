// Function to update the user_form.js to include route map rendering

// Listen for custom event from user_form.js
document.addEventListener('routeDataReceived', function(e) {
    const routeData = e.detail.routeData;
    const locationName = e.detail.locationName;
	console.log('Route data received:', routeData);
	console.log('Location name:', locationName);

    // Create or get route map section
    let routeMapSection = document.getElementById('route-map-section');
    if (!routeMapSection) {
        routeMapSection = document.createElement('section');
        routeMapSection.id = 'route-map-section';

        // Add the container after the location options section
        const locationOptions = document.getElementById('location-options');
        locationOptions.parentNode.insertBefore(routeMapSection, locationOptions.nextSibling);
    }

    routeMapSection.style.display = 'block';

    // Render the route map
    routeMapSection.innerHTML = '<div id="route-map-root"></div>';

    // Create a placeholder for the map
    const mapRoot = document.getElementById('route-map-root');
    mapRoot.innerHTML = `
        <div class="route-map-container">
            <div class="route-map-header">
                <h2 class="section-title">Your Journey to ${locationName}</h2>
                <div class="route-info-container">
                    <div class="route-info-card">
                        <div class="info-item">
                            <div class="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12"></path>
                                    <circle cx="12" cy="12" r="4"></circle>
                                </svg>
                            </div>
                            <div class="info-content">
                                <div class="info-label">Distance</div>
                                <div class="info-value">${formatDistance(routeData.paths[0].distance)}</div>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div class="info-content">
                                <div class="info-label">Duration</div>
                                <div class="info-value">${formatDuration(routeData.paths[0].time)}</div>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2 12h20M2 12l10-10M2 12l10 10"></path>
                                </svg>
                            </div>
                            <div class="info-content">
                                <div class="info-label">Elevation</div>
                                <div class="info-value">↑ ${routeData.paths[0].ascend.toFixed(1)}m ↓ ${routeData.paths[0].descend.toFixed(1)}m</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="map-container glass-card" id="map-placeholder">
                <div class="map-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading interactive map...</p>
                </div>
            </div>

            <div class="route-actions">
                <button class="action-button share-button">
                    <span class="button-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </span>
                    <span class="button-text">Share Route</span>
                </button>

                <button class="action-button download-button">
                    <span class="button-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </span>
                    <span class="button-text">Download GPX</span>
                </button>

                <button class="action-button directions-button">
                    <span class="button-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="22 12 18 8 14 12"></polyline>
                            <path d="M18 8v8"></path>
                            <polyline points="2 12 6 16 10 12"></polyline>
                            <path d="M6 16V8"></path>
                        </svg>
                    </span>
                    <span class="button-text">Get Directions</span>
                </button>
            </div>
        </div>
    `;

    // Show the route map section with animation
    routeMapSection.style.opacity = '0';
    routeMapSection.style.transform = 'translateY(20px)';

    setTimeout(() => {
        routeMapSection.style.transition = 'all 0.6s ease';
        routeMapSection.style.opacity = '1';
        routeMapSection.style.transform = 'translateY(0)';

        // Scroll to the route map section
        routeMapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Initialize the map
    initializeLeafletMap(routeData, 'map-placeholder', locationName);
});

// Helper function to format distance
function formatDistance(meters) {
    if (meters < 1000) {
        return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
}

// Helper function to format duration
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours} hr ${minutes % 60} min`;
    }
    return `${minutes} min`;
}

// Initialize Leaflet map with route data
function initializeLeafletMap(routeData, containerId, locationName) {
    // Load Leaflet CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    linkElement.crossOrigin = '';
    document.head.appendChild(linkElement);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';

    script.onload = function() {
        const L = window.L;
        const container = document.getElementById(containerId);

        // Remove loading indicator
        const loadingElement = container.querySelector('.map-loading');
        if (loadingElement) {
            loadingElement.remove();
        }

        if (!routeData || !routeData.paths || routeData.paths.length === 0) {
            console.error('No route data available');
            container.innerHTML = '<div class="error-message">Unable to load route data.</div>';
            return;
        }

        const path = routeData.paths[0];

        // Extract coordinates for start and end points
        const coordinates = path.points.coordinates;
        const startPoint = coordinates[0];
        const endPoint = coordinates[coordinates.length - 1];

        // Calculate center point of the route
        const bbox = path.bbox;
        const center = [
            (bbox[1] + bbox[3]) / 2,
            (bbox[0] + bbox[2]) / 2
        ];

        // Initialize map
        const map = L.map(containerId).setView(center, 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create polyline for the route
        const routePolyline = L.polyline(
            coordinates.map(coord => [coord[1], coord[0]]),
            {
                color: 'rgba(16, 185, 129, 0.8)',
                weight: 5,
                lineCap: 'round',
                lineJoin: 'round',
                opacity: 0.8
            }
        ).addTo(map);

        // Add an animated dash effect to the polyline using CSS
        const path_style = document.createElement('style');
        path_style.innerHTML = `
            .leaflet-interactive {
                stroke-dasharray: 10, 10;
                animation: dash 30s linear infinite;
            }
            @keyframes dash {
                to {
                    stroke-dashoffset: 1000;
                }
            }
        `;
        document.head.appendChild(path_style);

        // Set map view to fit the route
        map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });

        // Create custom icons for start and end points
        const startIcon = L.divIcon({
            className: 'custom-map-marker start-marker',
            html: '<div class="marker-icon start-icon"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const endIcon = L.divIcon({
            className: 'custom-map-marker end-marker',
            html: '<div class="marker-icon end-icon"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Add markers for start and end points
        L.marker([startPoint[1], startPoint[0]], { icon: startIcon })
            .addTo(map)
            .bindPopup('<strong>Starting Point</strong><br>Your current location')
            .openPopup();

        L.marker([endPoint[1], endPoint[0]], { icon: endIcon })
            .addTo(map)
            .bindPopup(`<strong>Destination</strong><br>${locationName || 'Selected location'}`);

        // Style the popups to match the website design
        const popupStyle = document.createElement('style');
        popupStyle.innerHTML = `
            .leaflet-popup-content-wrapper {
                background: rgba(10, 10, 15, 0.9);
                color: white;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            .leaflet-popup-tip {
                background: rgba(10, 10, 15, 0.9);
            }
            .leaflet-popup-content {
                margin: 10px 14px;
                font-family: 'Inter', sans-serif;
            }
            .leaflet-container a {
                color: var(--accent-green);
            }
            .leaflet-container {
                font-family: 'Inter', sans-serif;
            }
        `;
        document.head.appendChild(popupStyle);

        // Add distance markers along the route
        const totalDistance = path.distance;
        const markerInterval = 1000; // 1 km
        let distanceCovered = 0;

        // For each km, add a small dot marker
        for (let i = 1; i < coordinates.length; i++) {
            const prevCoord = coordinates[i - 1];
            const currCoord = coordinates[i];

            // Calculate distance between points
            const prevLatLng = L.latLng(prevCoord[1], prevCoord[0]);
            const currLatLng = L.latLng(currCoord[1], currCoord[0]);
            const segmentDistance = prevLatLng.distanceTo(currLatLng);

            distanceCovered += segmentDistance;

            // If we've covered another km, add a marker
            if (Math.floor(distanceCovered / markerInterval) > Math.floor((distanceCovered - segmentDistance) / markerInterval)) {
                const kmMark = Math.floor(distanceCovered / markerInterval);

                // Create a small dot marker
                const kmIcon = L.divIcon({
                    className: 'km-marker',
                    html: `<div class="km-dot"></div>`,
                    iconSize: [10, 10],
                    iconAnchor: [5, 5]
                });

                L.marker([currCoord[1], currCoord[0]], { icon: kmIcon })
                    .addTo(map)
                    .bindPopup(`<strong>${kmMark} km</strong>`);
            }
        }

        // Style for kilometer markers
        const kmStyle = document.createElement('style');
        kmStyle.innerHTML = `
            .km-dot {
                width: 10px;
                height: 10px;
                background: white;
                border: 2px solid var(--accent-violet);
                border-radius: 50%;
            }
        `;
        document.head.appendChild(kmStyle);

        // Add event listeners for action buttons
        const shareButton = document.querySelector('.share-button');
        const downloadButton = document.querySelector('.download-button');
        const directionsButton = document.querySelector('.directions-button');

        if (shareButton) {
            shareButton.addEventListener('click', function() {
                // This would normally use the Web Share API
                alert('Sharing functionality would be implemented here.');
            });
        }

        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                // This would normally generate a GPX file for download
                alert('GPX download functionality would be implemented here.');
            });
        }

        if (directionsButton) {
            directionsButton.addEventListener('click', function() {
                // Open in Google Maps or similar
                const startCoord = `${startPoint[1]},${startPoint[0]}`;
                const endCoord = `${endPoint[1]},${endPoint[0]}`;
                window.open(`https://www.google.com/maps/dir/${startCoord}/${endCoord}`);
            });
        }
    };

    document.body.appendChild(script);
}

// Add CSS styles for the route map
function addRouteMapStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .route-map-container {
            margin-top: 3rem;
            padding: 2rem;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .route-map-header {
            margin-bottom: 1.5rem;
        }

        .route-info-container {
            margin-bottom: 1.5rem;
        }

        .route-info-card {
            display: flex;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.25rem;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .info-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 12px;
            color: var(--accent-green);
        }

        .info-content {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 0.25rem;
        }

        .info-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .map-container {
            height: 500px;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            position: relative;
        }

        .map-loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(10, 10, 15, 0.7);
            color: var(--text-secondary);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top: 4px solid var(--accent-green);
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
        }

        .route-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .action-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            color: var(--text-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .action-button:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .share-button {
            color: var(--accent-blue);
        }

        .download-button {
            color: var(--accent-violet);
        }

        .directions-button {
            color: var(--accent-green);
        }

        .button-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Leaflet Map Custom Styles */
        .custom-map-marker {
            background: transparent;
        }

        .marker-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            position: relative;
        }

        .start-icon {
            background: rgba(16, 185, 129, 1);
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .start-icon:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
        }

        .end-icon {
            background: rgba(236, 72, 153, 1);
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .end-icon:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
        }
    `;

    document.head.appendChild(styleElement);
}

// Initialize the route map functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to load external styles
    if (!document.querySelector('link[href*="route_map.css"]')) {
        const routeMapStyles = document.createElement('link');
        routeMapStyles.rel = 'stylesheet';
        routeMapStyles.href = '/static/style/route_map.css';
        document.head.appendChild(routeMapStyles);
    }

    // Create a section for the route map if it doesn't exist
    if (!document.getElementById('route-map-section')) {
        const routeMapSection = document.createElement('section');
        routeMapSection.id = 'route-map-section';
        routeMapSection.style.display = 'none';

        // Find the best place to insert it (after location options or form section)
        const locationOptions = document.getElementById('location-options');
        if (locationOptions) {
            locationOptions.parentNode.insertBefore(routeMapSection, locationOptions.nextSibling);
        } else {
            const formSection = document.querySelector('.form-section');
            if (formSection) {
                formSection.parentNode.insertBefore(routeMapSection, formSection.nextSibling);
            } else {
                // Fallback: append to main container
                const container = document.querySelector('.container');
                if (container) {
                    container.appendChild(routeMapSection);
                }
            }
        }
    }
});