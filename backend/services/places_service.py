from backend import GOOGLE_MAPS_CLIENT
from ..helpers.place_result_parser import PlaceResult


class PlacesService:
    def __init__(self, place_ids: list[str]):
        """
        Initialize a PlacesService object with a list of Place IDs.

        :param place_ids: Multiple Place IDs, as identified by Google.
        :type place_ids: list[str]
        """
        self.place_ids: list[str] = place_ids

    def obtain_place_details(self, fields: list[str] | None = None) -> list[PlaceResult]:
        """
        Get more details about the place using Google's Place Details (Legacy) API.

        :return: A list of PlaceResults.
        """
        place_results: list[PlaceResult] = []
        fields = fields or [
            "name",
            "formatted_address",
            "geometry",
            "place_id"
        ]
        for place_id in self.place_ids:
            place = GOOGLE_MAPS_CLIENT.place(  # type: ignore[attr-defined]
                place_id=place_id,
                fields=fields
            )
            place_results.append(PlaceResult(place["result"]))

        return place_results
