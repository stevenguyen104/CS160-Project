class PlaceResult:
    def __init__(self, place_result: dict):
        """
        Initialize a PlaceResult with a PlaceResult object from Google's Location Selection API. See:
        https://developers.google.com/maps/documentation/mobility/location-selection-api/reference/rest/v1beta/PlaceResult
        """
        self.place_result = place_result

    def get_place(self) -> dict:
        return self.place_result

    def get_address(self) -> str:
        return self.place_result["formatted_address"]

    def get_geometry(self) -> dict:
        return self.place_result["geometry"]

    def get_location(self) -> dict:
        geometry = self.get_geometry()
        return geometry["location"]

    def get_latitude(self) -> float:
        location = self.get_location()
        return location["lat"]

    def get_longitude(self) -> float:
        location = self.get_location()
        return location["lng"]

    def get_name(self) -> str:
        return self.place_result["name"]

    def get_place_id(self) -> str:
        return self.place_result["place_id"]
