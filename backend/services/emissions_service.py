import requests

from backend import RAPIDAPI_KEY
from ..helpers.emissions_estimate_parser import EmissionsEstimate


class EmissionsService:
    def __init__(self, vehicle_make: str, vehicle_model: str, distance_value: float, distance_unit: str = "km"):
        """
        Initialize an EmissionsService object with the required parameters.

        :param vehicle_make: The make of the vehicle
        :type vehicle_make: str
        :param vehicle_model: The model of the vehicle
        :type vehicle_model: str
        :param distance_value: The distance traveled using the vehicle
        :type distance_value: float
        :param distance_unit: The units of measurement (e.g. kilometers, miles)
        :type distance_unit: str
        """
        self.vehicle_make: str = vehicle_make
        self.vehicle_model: str = vehicle_model
        self.distance_value: float = distance_value
        self.distance_unit: str = distance_unit
        self.url: str = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"

    def obtain_emissions(self) -> EmissionsEstimate:
        """
        Obtain estimates of emissions by driving a specified vehicle for a specified distance.

        :return: An EmissionsEstimate object.
        """
        with requests.Session() as session:
            session.headers.update({
                "x-rapidapi-key": RAPIDAPI_KEY,
                "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded"
            })

            data = {
                "vehicle_make": self.vehicle_make,
                "vehicle_model": self.vehicle_model,
                "distance_value": self.distance_value,
                "distance_unit": self.distance_unit
            }

            response = session.post(self.url, data=data)
            return EmissionsEstimate(response.json())
