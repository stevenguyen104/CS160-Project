import json


class PlaceResult:
    def __init__(self, place_result: json):
        self.place_result = place_result

    def get_place(self) -> dict:
        return self.place_result.get("place")

    def get_address(self) -> dict:
        place = self.get_place()
        return place.get("address")

    def get_geometry(self) -> dict:
        place = self.get_place()
        return place.get("geometry")

    def get_location(self) -> dict:
        geometry = self.get_geometry()
        return geometry.get("location")

    def get_latitude(self) -> float:
        location = self.get_location()
        return location.get("latitude")

    def get_longitude(self) -> float:
        location = self.get_location()
        return location.get("longitude")

    def get_name(self) -> str:
        place = self.get_place()
        return place.get("displayName")

    def get_place_id(self) -> str:
        place = self.get_place()
        return place.get("placeId")
