from googlemaps import Client

from ..helpers.place_result_parser import PlaceResult
from ..helpers.directions_response_parser import DirectionsResponse


class DirectionsService:
    def __init__(self, place_results: list[PlaceResult], gmaps_client: Client):
        """
        Initialize a DirectionsService object with a list of PlaceResults.

        :param place_results: A list of PlaceResults.
        :type place_results: list[PlaceResult]
        :param gmaps_client: A Google Maps client.
        :type gmaps_client: Client
        """
        if len(place_results) < 2:
            raise ValueError("At least an origin and destination are required to get directions.")

        self.place_results: list[PlaceResult] = place_results
        self.gmaps_client: Client = gmaps_client

    def obtain_directions(self) -> DirectionsResponse:
        """
        Compute directions using Google Maps Directions API.

        :return: A DirectionsResponse object.
        """
        first_place_result: PlaceResult = self.place_results[0]
        last_place_result: PlaceResult = self.place_results[-1]
        rest_of_place_results: list[PlaceResult] = self.place_results[1:-1]

        origin: tuple[float, float] = (
            first_place_result.get_latitude(),
            first_place_result.get_longitude())
        destination: tuple[float, float] = (
            last_place_result.get_latitude(),
            last_place_result.get_longitude())
        waypoints: list[tuple[float, float]] = [(
            result.get_latitude(),
            result.get_longitude())
            for result in rest_of_place_results]
        mode = "driving"  # TODO let users customize; examples are cycling, driving
        departure_time = "now"  # TODO let users customize
        units = "imperial"  # TODO let users customize

        directions = self.gmaps_client.directions(  # type: ignore[attr-defined]
            origin=origin,
            destination=destination,
            waypoints=waypoints,
            mode=mode,
            departure_time=departure_time,
            units=units
        )

        return DirectionsResponse(directions[0])
