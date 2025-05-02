import os
import logging

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import google.generativeai as genai

from src.models.user_data import UserData
from src.models.location import Location, Place
from src.services.graphhopper import reverse_geocode
from src.services.generative_ai import generate_locations

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

@router.post("/user-data/", response_model=dict)
def handle_input(data: UserData,location: Location):
    lat = location.lat
    long = location.lng
    logger.debug(f"Received lat: {lat}, long: {long}")
    address = reverse_geocode(lat, long)

    if address is not None:
        address = Place(**address)

    generated_locations = generate_locations(data, address)
    return {
        "locations": generated_locations
    }
    

@router.get("/input-form", response_class=HTMLResponse)
def get_input_form(request: Request):
    return templates.TemplateResponse("user_form.html", {"request": request, "title": "Travel Data Form"})



# @router.post("/get-location-info", response_class=HTMLResponse)
# def get_location_info(location: Location):
#     lat = location.lat
#     long = location.long
#     address = reverse_geocode(lat, long)
#     if address is not None:
#         address = Place(**address)
#     return templates.TemplateResponse("location_info.html", {"request": Request, "address": address, "lat": lat, "long": long})