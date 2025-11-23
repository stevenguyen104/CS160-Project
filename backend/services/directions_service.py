from backend import GOOGLE_MAPS_CLIENT
from ..helpers.place_result_parser import PlaceResult
from ..helpers.directions_response_parser import DirectionsResponse


class DirectionsService:
    def __init__(self, place_results: list[PlaceResult]):
        """
        Initialize a DirectionsService object with a list of PlaceResults.

        :param place_results: A list of PlaceResults.
        :type place_results: list[PlaceResult]
        """
        if len(place_results) < 2:
            raise ValueError("At least an origin and destination are required to get directions.")

        self.place_results: list[PlaceResult] = place_results

    def obtain_directions(self, avoid_tolls: bool = False, alternatives: bool = False) -> DirectionsResponse:
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
        units = "imperial"  # TODO let users customize
        avoid = "tolls" if avoid_tolls else None

        directions = GOOGLE_MAPS_CLIENT.directions(  # type: ignore[attr-defined]
            origin=origin,
            destination=destination,
            waypoints=waypoints,
            mode="driving",
            departure_time="now",
            units=units,
            avoid=avoid,
            alternatives=alternatives
        )

        # If alternatives is False, then len(directions) == 0 is True
        responses = [DirectionsResponse(direction) for direction in directions]
        shortest_route = min(responses, key=lambda x: x.get_total_distance())
        return shortest_route
