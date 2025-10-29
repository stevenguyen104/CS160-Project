from supabase import Client

from ...api.placeresult import PlaceResult


class StopRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the stop repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase: Client = supabase_client

    def add_stop(self, trip_id: int, stop: PlaceResult, stop_order: int) -> dict:
        """
        Add a new stop to the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop: A PlaceResult object
        :type stop: PlaceResult
        :param stop_order: The order in which the stop would be placed; lower numbers go first
        :type stop_order: int
        :return: The newly added stop
        :rtype: dict
        """
        data = {
            "trip_id": trip_id,
            "latitude": stop.get_latitude(),
            "longitude": stop.get_latitude(),
            "name": stop.get_name(),
            "stop_order": stop_order,
            "place_id": stop.get_place_id(),
            "address": stop.get_address()
        }

        response = (self.supabase.table("stops")
                    .insert(data)
                    .execute())
        return response.data[0] if response.data else None

    def add_stops(self, trip_id: int, stops: list[PlaceResult]) -> list[dict]:
        """
        Add a list of stops to the stop repository.
        :param trip_id: Trip ID
        :type trip_id: int
        :param stops: List of stops not including the trip ID
        :type stops: list[dict]
        :return: The newly added stops
        :rtype: list[dict]
        """
        data = [{
            "trip_id": trip_id,
            "name": stop.get_name(),
            "latitude": stop.get_latitude(),
            "longitude": stop.get_longitude(),
            "stop_order": i + 1,
            "place_id": stop.get_place_id(),
            "address": stop.get_address()
        } for i, stop in enumerate(stops)]

        response = (self.supabase.table("stops")
                    .insert(data)
                    .execute())
        return response.data

    def get_stops(self, trip_id: int) -> list[dict]:
        """
        Get all stops for a trip.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: List of stops for the trip
        :rtype: list[dict]
        """
        response = (self.supabase.table("stops")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .order("stop_order", desc=False)
                    .execute())
        return response.data

    def get_stop(self, trip_id: int, stop_id: int) -> dict:
        """
        Get a stop by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :return: Stop data
        :rtype: dict
        """
        response = (self.supabase.table("stops")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .limit(1)
                    .single()
                    .execute())
        return response.data

    def delete_stop(self, trip_id: int, stop_id: int) -> dict:
        """
        Delete a stop from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :return: The stop that was deleted
        :rtype: dict
        """
        response = (self.supabase.table("stops")
                    .delete()
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .execute())
        return response.data[0] if response.data else None

    def delete_stops(self, trip_id: int) -> list[dict]:
        """
        Delete stops from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: The stops that were deleted
        :rtype: dict
        """
        response = (self.supabase.table("stops")
                    .delete()
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data

    def reorder_stop(self, trip_id: int, stop_id: int, new_order: int) -> dict:
        """
        Update the stop order for a stop from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :param new_order: New order for the stop to be reordered to
        :type new_order: int
        :return: Updated stop with the changed order
        :rtype: dict
        """
        new_data = {
            "stop_order": new_order
        }

        response = (self.supabase.table("stops")
                    .update(new_data)
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .execute())
        return response.data[0] if response.data else 0
