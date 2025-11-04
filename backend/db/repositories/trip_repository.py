from datetime import datetime, timezone
from uuid import UUID

from supabase import Client


class TripRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the trip repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase: Client = supabase_client

    def create_trip(self, user_id: UUID, name: str):
        """
        Create a new trip.

        :param user_id: User ID
        :type user_id: UUID
        :param name: The name of the trip
        :type name: str
        :return: The newly created trip data
        """
        data = {
            "user_id": str(user_id),
            "name": name,
            "last_modified": str(datetime.now(timezone.utc))
        }

        response = (self.supabase.table("trips")
                    .insert(data)
                    .execute())
        return response.data[0] if response.data else None

    def get_trip(self, trip_id: int):
        """
        Get a trip by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: Trip data
        """
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .limit(1)
                    .single()
                    .execute())
        return response.data

    def get_trips(self, user_id: UUID):
        """
        Get all trips for a user.

        :param user_id: User ID
        :type user_id: UUID
        :return: All trips belonging to a user
        """
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("user_id", str(user_id))
                    .execute())
        return response.data

    def update_trip(self, trip_id: int, new_name: str):
        """
        Update trip attributes (last modified in this case).

        :param trip_id: Trip ID
        :type trip_id: int
        :param new_name: The new name of the trip
        :type new_name: str
        :return: The updated trip data
        """
        new_data = {
            "last_modified": str(datetime.now(timezone.utc)),
            "name": new_name
        }

        response = (self.supabase.table("trips")
                    .update(new_data)
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None

    def delete_trip(self, trip_id: int):
        """
        Delete a trip by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: The trip that was deleted
        """
        response = (self.supabase.table("trips")
                    .delete()
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None
