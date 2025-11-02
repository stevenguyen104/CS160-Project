class DirectionsResponse:
    def __init__(self, directions_response: dict):
        """
        Initialize a DirectionsResponse with a DirectionsResponse object from Google's Directions API. See:
        https://developers.google.com/maps/documentation/directions/get-directions#DirectionsResponse
        """
        self.directions_response: dict = directions_response

    def get_dict(self) -> dict:
        return self.directions_response

    def get_routes(self) -> list[dict]:
        return self.directions_response["routes"]

    def get_geocoded_waypoints(self) -> list[dict] | None:
        return self.directions_response.get("geocoded_waypoints")

    def get_available_travel_modes(self) -> list[dict] | None:
        return self.directions_response.get("available_travel_modes")

    def get_distances(self) -> list[int]:
        """
        Obtains a list of distances in meters
        """
        legs: list = self.directions_response["legs"]
        distance_meters: list[int] = [leg["distance"]["value"] for leg in legs]
        return distance_meters
