import requests
import os


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
        print(f"Error making request: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"Error parsing response: {e}")
        return None
