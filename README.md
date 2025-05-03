# Leisure - Discover Your Next Adventure

Leisure is an interactive web application that helps users discover and plan activities based on their available time and preferences. The application uses geolocation to find nearby attractions and provides detailed routing information to help users navigate to their chosen destinations.

## Overview

Leisure solves the common problem of "What should I do today?" by suggesting personalized leisure activities based on:
- Date and time availability
- How far you're willing to travel
- How much time you have available
- Optional specific destination preferences

## Video Preview
![0503](https://github.com/user-attachments/assets/f027e685-c130-4952-bf48-1c060c6f1092)

## User Flow

1. **Input Preferences**: Users specify their available date, time range, maximum travel distance, and duration
2. **Discover Options**: The application suggests personalized destinations based on the user's criteria
3. **Select Destination**: Users choose from the suggested locations
4. **View Route**: Detailed route information, including distance, duration, and an interactive map is displayed
5. **Navigate or Share**: Users can get directions, download route information, or share their plans

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI (Python)
- **Mapping**: Leaflet.js with OpenStreetMap
- **Routing**: GraphHopper API
- **AI Suggestions**: Google Generative AI

## Screenshots

### User Input Form
![User Input Form](./assets/images/user_input_form_1_step.png)
*The main form where users enter their availability and preferences*

### Location Selection
![Location Selection](./assets/images/location_selection_2_step.png)
*The application suggests personalized options based on user input*

### Route Map Display
![Route Display](./assets/images/map_illustration_3_step.png)
*Interactive map showing the route to the selected destination*

## Features

- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Interactive Time Selector**: Visual slider for selecting available time ranges
- **Location Discovery**: AI-powered suggestions based on user preferences
- **Interactive Map**: Detailed routing with distance markers and elevation data
- **Sharing Options**: Easy sharing of route information with others

## Local Development

### Prerequisites
- Python 3.8+
- Node.js (for Vercel CLI if deploying)

### Installation

1. Clone the repository:
