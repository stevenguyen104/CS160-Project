import requests

from backend import GOOGLE_MAPS_API_KEY
from ..helpers.aqi_response_parser import AQIResponse
from ..helpers.place_result_parser import PlaceResult


class AQIService:
    def __init__(self, place_results: list[PlaceResult]):
        """
        Initialize an AQIService object with a list of PlaceResults.

        :param place_results: A list of PlaceResults.
        :type place_results: list[PlaceResult]
        """
        if len(place_results) < 1:
            raise ValueError("At least one location is required to obtain AQI information.")

        self.place_results: list[PlaceResult] = place_results
        self.url: str = "https://airquality.googleapis.com/v1/currentConditions:lookup/"

    def obtain_multiple_aqi(self) -> list[AQIResponse]:
        """
        Obtain the AQIs of all locations provided.

        :return: A list of AQIResponse objects.
        """
        aqi_responses: list[AQIResponse] = []
        with requests.Session() as session:
            session.headers.update({
                "Content-Type": "application/json"
            })

            session.params = ({
                "key": GOOGLE_MAPS_API_KEY
            })

            for place_result in self.place_results:
                latitude = place_result.get_latitude()
                longitude = place_result.get_latitude()
                json_data = {
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude
                    }
                }

                response = session.post(self.url, json=json_data)
                aqi_responses.append(AQIResponse(response.json()))

            return aqi_responses
