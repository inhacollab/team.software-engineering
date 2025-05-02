
from pydantic import BaseModel, Field

class Location(BaseModel):
    lat: float = Field(default=37.45314546526485)
    lng: float = Field(default=126.65732538112354)

class Place(BaseModel):
    point: Location
    name: str
    country: str
    countrycode: str
    city: str
    street: str