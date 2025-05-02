// Configuration
const API_ENDPOINT = 'user-data/';

// DOM Elements
const form = document.getElementById('leisure-form');
const resultCard = document.getElementById('result-card');
const timeRangeDisplay = document.getElementById('time-range-display');
const timeSelector = document.querySelector('.time-selector');
const timeRangeHighlight = document.querySelector('.time-range-highlight');
const startHandle = document.querySelector('.time-handle-start');
const endHandle = document.querySelector('.time-handle-end');
const startTooltip = startHandle.querySelector('.handle-tooltip');
const endTooltip = endHandle.querySelector('.handle-tooltip');

// Time Range State
let timeRangeState = {
    start: 10, // 10:00 AM (10 hours from midnight)
    end: 22,   // 10:00 PM (22 hours from midnight)
    dragging: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInput();
    initializeTimeRange();
    setupFormInteractions();
    setupFormSubmission();
});

// Initialize date input with today as minimum
function initializeDateInput() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('availability-date').setAttribute('min', today);
}

// Initialize time range selector
function initializeTimeRange() {
    updateTimeRange();

    // Mouse events for dragging
    startHandle.addEventListener('mousedown', (e) => startDragging(e, 'start'));
    endHandle.addEventListener('mousedown', (e) => startDragging(e, 'end'));

    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', stopDragging);

    // Touch events for mobile (though this is desktop-first)
    startHandle.addEventListener('touchstart', (e) => startDragging(e, 'start'));
    endHandle.addEventListener('touchstart', (e) => startDragging(e, 'end'));

    document.addEventListener('touchmove', handleDragging);
    document.addEventListener('touchend', stopDragging);
}

// Start dragging time handle
function startDragging(e, type) {
    e.preventDefault();
    timeRangeState.dragging = type;
    const handle = type === 'start' ? startHandle : endHandle;
    handle.classList.add('dragging');
}

// Handle dragging movement
function handleDragging(e) {
    if (!timeRangeState.dragging) return;

    e.preventDefault();
    const rect = timeSelector.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const hours = Math.round(percentage * 24);

    if (timeRangeState.dragging === 'start') {
        timeRangeState.start = Math.min(hours, timeRangeState.end - 1);
    } else {
        timeRangeState.end = Math.max(hours, timeRangeState.start + 1);
    }

    updateTimeRange();
}

// Stop dragging
function stopDragging() {
    if (timeRangeState.dragging) {
        const handle = timeRangeState.dragging === 'start' ? startHandle : endHandle;
        handle.classList.remove('dragging');
        timeRangeState.dragging = null;
    }
}

// Update time range display
function updateTimeRange() {
    const startPercentage = (timeRangeState.start / 24) * 100;
    const endPercentage = (timeRangeState.end / 24) * 100;

    startHandle.style.left = `${startPercentage}%`;
    endHandle.style.left = `${endPercentage}%`;

    timeRangeHighlight.style.left = `${startPercentage}%`;
    timeRangeHighlight.style.width = `${endPercentage - startPercentage}%`;

    // Update tooltips
    startTooltip.textContent = formatTime(timeRangeState.start);
    endTooltip.textContent = formatTime(timeRangeState.end);

    // Update display text
    timeRangeDisplay.textContent = `${formatTime(timeRangeState.start)} - ${formatTime(timeRangeState.end)}`;
}

// Format hour to 12-hour time
function formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
}

// Format hour to 24-hour time string (HH:mm)
function formatTime24(hour) {
    return `${hour.toString().padStart(2, '0')}:00`;
}

// Setup form interactions
function setupFormInteractions() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    // Input validations
    const distanceInput = document.getElementById('distance');
    const durationInput = document.getElementById('duration');

    distanceInput.addEventListener('input', () => {
        if (distanceInput.value < 0) distanceInput.value = 0;
        if (distanceInput.value > 1000) distanceInput.value = 1000;
    });

    durationInput.addEventListener('input', () => {
        if (durationInput.value < 0) durationInput.value = 0;
        if (durationInput.value > 48) durationInput.value = 48;
    });
}

// Show location options
function showLocationOptions(locations) {
    const locationOptions = document.getElementById('location-options');
    const locationCards = document.getElementById('location-cards');

    // Clear previous options
    locationCards.innerHTML = '';

    // Populate new options
    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <h3>${location.location}</h3>
            <p>${location.description}</p>
        `;
        locationCards.appendChild(card);
    });

    // Display the section
    locationOptions.style.display = 'block';
}

// Setup form submission
async function setupFormSubmission() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const date = document.getElementById('availability-date').value;
        const distance = parseFloat(document.getElementById('distance').value);
        const duration = parseFloat(document.getElementById('duration').value);
        const destination = document.getElementById('destination').value;

        let location;
        let userData = {
            date: date,
            distance_km: distance,
            duration_hours: duration,
            destination: destination || null,
            time_range: {
                start: formatTime24(timeRangeState.start),
                end: formatTime24(timeRangeState.end)
            }
        };

        // Get current location first
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
        } catch (error) {
            console.error('Error getting location:', error);
            showResult(false, 'Unable to retrieve your location.');
            return;
        }


        // UI feedback
        const submitButton = form.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const originalText = buttonText.textContent;

        submitButton.disabled = true;
        buttonText.textContent = 'Planning your adventure...';
        submitButton.style.transform = 'scale(0.98)';

        try {
            console.log('User data:', userData);
            console.log('Location data:', location);
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: userData,
                    location: location
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Show location options
            showLocationOptions(result.locations);

            // Show success message
            showResult(true);

            // Log for debugging
            console.log('API response:', result);

        } catch (error) {
            console.error('Error submitting form:', error);
            showResult(false, error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.textContent = originalText;
            submitButton.style.transform = 'scale(1)';
        }
    });
}

// Show result card with animation
function showResult(success, errorMessage = '') {
    const resultTitle = resultCard.querySelector('.result-title');
    const resultMessage = resultCard.querySelector('.result-message');

    if (success) {
        resultTitle.textContent = 'Adventure Confirmed!';
        resultMessage.textContent = 'Your leisure plan has been submitted successfully.';
        resultTitle.style.color = 'var(--accent-green)';

        // Animate checkmark
        animateCheckmark();
    } else {
        resultTitle.textContent = 'Oops!';
        resultMessage.textContent = `Something went wrong: ${errorMessage}`;
        resultTitle.style.color = 'var(--accent-pink)';
    }

    // Show result card
    resultCard.style.display = 'block';
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(20px)';

    // Animate in
    setTimeout(() => {
        resultCard.style.transition = 'all 0.5s ease';
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 10);

    // Scroll to result
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Animate checkmark SVG
function animateCheckmark() {
    const circle = document.querySelector('.checkmark-circle');
    const check = document.querySelector('.checkmark-check');

    // Reset animation
    circle.style.strokeDashoffset = '166';
    check.style.strokeDashoffset = '48';

    // Animate circle
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 0.6s ease';
        circle.style.strokeDashoffset = '0';
    }, 100);

    // Animate check
    setTimeout(() => {
        check.style.transition = 'stroke-dashoffset 0.3s ease';
        check.style.strokeDashoffset = '0';
    }, 600);
}

// Additional UX enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle hover effects
    const submitButton = form.querySelector('.submit-button');

    submitButton.addEventListener('mouseenter', () => {
        submitButton.style.transform = 'translateY(-2px)';
    });

    submitButton.addEventListener('mouseleave', () => {
        submitButton.style.transform = 'translateY(0)';
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add keyboard navigation for time selector
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === startHandle || document.activeElement === endHandle) {
            const isStart = document.activeElement === startHandle;

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (isStart) {
                        timeRangeState.start = Math.max(0, timeRangeState.start - 1);
                    } else {
                        timeRangeState.end = Math.max(timeRangeState.start + 1, timeRangeState.end - 1);
                    }
                    updateTimeRange();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (isStart) {
                        timeRangeState.start = Math.min(timeRangeState.end - 1, timeRangeState.start + 1);
                    } else {
                        timeRangeState.end = Math.min(24, timeRangeState.end + 1);
                    }
                    updateTimeRange();
                    break;
            }
        }
    });

    // Make handles focusable
    startHandle.setAttribute('tabindex', '0');
    endHandle.setAttribute('tabindex', '0');
});