import requests
import os
import logging
import urllib


logger = logging.getLogger(__name__)


def reverse_geocode(lat, lon):
    try:
        url = "https://graphhopper.com/api/1/geocode"
        params = {
            "reverse": "true",
            "point": f"{lat},{lon}",
            "key": f"{os.getenv('GRAPH_HOPPER_API_KEY')}",
        }
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        if data["hits"]:
            return data["hits"][0]
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error making request: {e}")
        return None
    except (KeyError, ValueError) as e:
        logger.error(f"Error parsing response: {e}")
        return None


def _get_coordinates(place_name):
    response = requests.get(
        "https://graphhopper.com/api/1/geocode",
        params={
            "q": place_name,
            "limit": 1,
            "key": f"{os.getenv('GRAPH_HOPPER_API_KEY')}",
        },
    )
    data = response.json()
    print(data)
    point = data["hits"][0]["point"]
    return point["lat"], point["lng"]


def _get_route(start, end):
    op = "&point=" + str(start[0]) + "%2C" + str(start[1])
    dp = "&point=" + str(end[0]) + "%2C" + str(end[1])
    route_url = "https://graphhopper.com/api/1/route?"
    response = requests.get(
        route_url
        + urllib.parse.urlencode(
            {
                "key": os.getenv("GRAPH_HOPPER_API_KEY"),
                "profile": "car",
                "locale": "en",
                "points_encoded": "false",
            }
        )
        + op
        + dp
    )
    paths_data = response.json()
    print(paths_data)
    distance_m = paths_data["paths"][0]["distance"]
    time_ms = paths_data["paths"][0]["time"]
    miles = distance_m / 1000 / 1.61
    km = distance_m / 1000
    sec = int(time_ms / 1000 % 60)
    min = int(time_ms / 1000 / 60 % 60)
    hr = int(time_ms / 1000 / 60 / 60)
    instructions = []
    for each in range(len(paths_data["paths"][0]["instructions"])):
        path = paths_data["paths"][0]["instructions"][each]["text"]
        distance = paths_data["paths"][0]["instructions"][each]["distance"]
        instructions.append(
            {
                "path": path,
                "distance": distance,
            }
        )
    return {
        "distance_miles": miles,
        "distance_km": km,
        "duration_hours": hr,
        "duration_minutes": min,
        "duration_seconds": sec,
        "instructions": instructions,
    }


def get_trip_info(lat, lng, destination_name):
    dest_coords = _get_coordinates(destination_name)
    route_data = _get_route((lat, lng), dest_coords)
    return route_data
