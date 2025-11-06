from supabase import Client

from ...helpers.place_result_parser import PlaceResult


class StopRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the stop repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase: Client = supabase_client

    def add_stop(self, trip_id: int, stop: PlaceResult, stop_order: int):
        """
        Add a new stop to the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop: A PlaceResult object
        :type stop: PlaceResult
        :param stop_order: The order in which the stop would be placed; lower numbers go first
        :type stop_order: int
        :return: The newly added stop
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

    def add_stops(self, trip_id: int, stops: list[PlaceResult]):
        """
        Add a list of stops to the stop repository.
        :param trip_id: Trip ID
        :type trip_id: int
        :param stops: List of stops not including the trip ID
        :type stops: list[dict]
        :return: The newly added stops
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

    def get_stops(self, trip_id: int):
        """
        Get all stops for a trip.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: List of stops for the trip
        """
        response = (self.supabase.table("stops")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .order("stop_order", desc=False)
                    .execute())
        return response.data

    def get_stop(self, trip_id: int, stop_id: int):
        """
        Get a stop by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :return: Stop data
        """
        response = (self.supabase.table("stops")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .limit(1)
                    .single()
                    .execute())
        return response.data

    def delete_stop(self, trip_id: int, stop_id: int):
        """
        Delete a stop from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :return: The stop that was deleted
        """
        response = (self.supabase.table("stops")
                    .delete()
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .execute())
        return response.data[0] if response.data else None

    def delete_stops(self, trip_id: int):
        """
        Delete stops from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: The stops that were deleted
        """
        response = (self.supabase.table("stops")
                    .delete()
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data

    def reorder_stop(self, trip_id: int, stop_id: int, new_order: int):
        """
        Update the stop order for a stop from the stop repository.

        :param trip_id: Trip ID
        :type trip_id: int
        :param stop_id: Stop ID
        :type stop_id: int
        :param new_order: New order for the stop to be reordered to
        :type new_order: int
        :return: Updated stop with the changed order
        """
        new_data = {
            "stop_order": new_order
        }

        response = (self.supabase.table("stops")
                    .update(new_data)
                    .eq("trip_id", trip_id)
                    .eq("stop_id", stop_id)
                    .execute())
        return response.data[0] if response.data else None
