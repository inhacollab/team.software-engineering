from datetime import date
from pydantic import BaseModel, Field


class TimeRange(BaseModel):
    start: str = Field(default="")
    end: str = Field(default="")


class UserData(BaseModel):
    date: date
    distance_km: float = Field(default=0.0)
    duration_hours: float = Field(default=0.0)
    destination: str | None = Field(default=None)
    time_range: TimeRange = Field(default_factory=TimeRange)


class PlaceSelected(BaseModel):
    name: str
    lat: float = Field(default=0.0)
    lng: float = Field(default=0.0)
