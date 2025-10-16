import uuid
from supabase import Client


class TripRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the user repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase = supabase_client

    def create_trip(self, user_id: uuid.UUID, emissions: list[float] = None) -> dict:
        """
        Create a new trip.

        :param user_id: User ID
        :type user_id: UUID
        :param emissions: Emissions to add to the trip, stored individually between two stops
        :type emissions: list[float]
        :return: Trip data
        :rtype: dict
        """
        response = (self.supabase.table("trips")
                    .insert({
                        "user_id": str(user_id),
                        "emissions": emissions or [0.0]
                    }).execute())
        return response.data

    def get_trip(self, trip_id: int) -> dict:
        """
        Get a trip by its ID.
        :param trip_id: Trip ID
        :type trip_id: int
        :return: Trip data
        :rtype: dict
        """
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None

    def get_trips(self, user_id: uuid.UUID):
        """
        Get all trips for a user.

        :param user_id: User ID
        :type user_id: UUID
        :return: All trips for a user with the specified ID
        :rtype: dict
        """
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("user_id", str(user_id))
                    .execute())
        return response.data

    def update_trip(self, trip_id: int, emissions: list[float] = None) -> dict:
        """
        Update trip attributes (emissions).

        :param trip_id: Trip ID
        :type trip_id: int
        :param emissions: Emissions to add to the trip, stored individually between two stops
        :type emissions: list[float]
        :return: Trip data
        :rtype: dict
        """
        response = (self.supabase.table("trips")
                    .update({
                        "emissions": emissions or [0.0]
                    }).eq("trip_id", trip_id)
                    .execute())
        return response.data

    def delete_trip(self, trip_id: int) -> bool:
        """
        Delete a trip by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: True if the trip was deleted successfully, False otherwise.
        :rtype: bool
        """
        response = (self.supabase.table("trips")
                    .delete()
                    .eq("trip_id", trip_id)
                    .execute())
        return response.error is None and bool(response.data)
