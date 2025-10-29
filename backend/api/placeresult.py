class PlaceResult:
    def __init__(self, place_result: dict):
        """
        Initialize a PlaceResult with a Google.maps.places.PlaceResult object.
        """
        self.place_result = place_result or {}

    def get_place(self) -> dict:
        return self.place_result

    def get_address(self) -> str:
        place = self.get_place()
        return place.get("formatted_address") or place.get("address")

    def get_geometry(self) -> dict | None:
        place = self.get_place()
        return place.get("geometry")

    def get_location(self) -> dict | None:
        geometry = self.get_geometry()
        if not geometry:
            return None
        return geometry.get("location")

    def get_latitude(self) -> float | None:
        location = self.get_location()
        if not location:
            return None
        lat = location.get("lat")
        return lat() if callable(lat) else lat

    def get_longitude(self) -> float | None:
        location = self.get_location()
        if not location:
            return None
        lng = location.get("lng")
        return lng() if callable(lng) else lng

    def get_name(self) -> str:
        place = self.get_place()
        return place.get("name")

    def get_place_id(self) -> str:
        place = self.get_place()
        return place.get("place_id")