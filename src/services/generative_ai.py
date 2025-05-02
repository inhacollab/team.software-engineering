import os
import google.generativeai as genai
from src.models.user_data import UserData
from src.models.location import Place
from string import Template

# {"date":"2025-05-15","distance_km":10.0,"duration_hours":1.0,"destination":"Seoul","time_range":{"start":"10:00","end":"16:00"}}
def generate_locations(data: UserData,address: Place):
    prompt = Template("""
You are an intelligent location recommender for short leisure trips.
A user has submitted their availability and preferences. Based on their input, recommend places they can visit within their **available time**, **distance**, and **desired experience**.
---
### Your Task:
Based on this input:
1. Suggest a list of **interesting places** the user can realistically visit **within the specified city/area** (e.g., Incheon), considering their max distance and time limits.
2. Each place should be a **short leisure destination** (e.g., parks, themed cafes, walking spots, art museums, open rooftops, quiet bookstores).
3. For each place, provide:
   * `"location"`: the name of the place
   * `"description"`: a warm, inviting description of what the user can enjoy there (activities, vibe, photo ops, atmosphere)
4. Output should be a **JSON array of location suggestions**, like:
```json
[
  {
    "location": "Inspire Island",
    "description": "A peaceful waterfront resort with pools, relaxing lounges, and stunning architecture — perfect for unwinding and taking memorable photos."
  },
  {
    "location": "Jayu Park",
    "description": "A beautiful hillside park with cherry blossoms, ocean views, and a peaceful walking trail — great for a reflective stroll."
  }
]
```
### About User Input:
- Date: It is time when user has free time.
- Distance: The maximum distance the user is willing to travel from their starting point.
- Duration: The maximum time the user has available for the trip.
- Preferred destination: Preferred city or area for the trip. Note that this is optional and can be empty.
- Start time: The earliest time the user can start their trip.
- End time: The latest time the user can finish their trip.
- Current street: The street where the user is currently located.
- Current city: The city where the user is currently located.
- Current country: The country where the user is currently located.

Use your imagination, but keep it grounded in what's reasonable for the city, range, and time.
---
Here data user input:
Date: $date
Distance: $distance_km km
Duration: $duration_hours hours
Preferred destination: $destination
Start time: $start
End time: $end
Current street: $street
Current city: $city
Current country: $country
---
"""
   )
    # Format the prompt with the data
    prompt = prompt.substitute(
        date=data.date,
        distance_km=data.distance_km,
        duration_hours=data.duration_hours,
        destination=data.destination,
        start=data.time_range.start,
        end=data.time_range.end,
        street = address.street,
        city = address.city,
        country = address.country,
    )
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0 flash")
    try:
        # Generate content using the Gemini API
        response = model.generate_content(prompt)
        # Check if a response was generated.
        if response and response.text:
            return response.text
        else:
            print("Error: No text response from Gemini API.")
            return None
    except Exception as e:
        print(f"Error sending prompt to Gemini API: {e}")
        return None
    return prompt