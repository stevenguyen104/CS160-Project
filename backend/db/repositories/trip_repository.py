import uuid
from datetime import datetime, timezone

from supabase import Client


class TripRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the trip repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase: Client = supabase_client

    def create_trip(self, user_id: uuid.UUID, name: str) -> dict:
        """
        Create a new trip.

        :param user_id: User ID
        :type user_id: UUID
        :param name: Trip Name
        :type name: string
        :return: The newly created trip data
        :rtype: dict
        """
        data = {
            "user_id": str(user_id),
            "name": name
        }

        response = (self.supabase.table("trips")
                    .insert(data)
                    .execute())
        return response.data[0] if response.data else None

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
                    .limit(1)
                    .single()
                    .execute())
        return response.data

    def get_trips(self, user_id: uuid.UUID) -> list[dict]:
        """
        Get all trips for a user.

        :param user_id: User ID
        :type user_id: UUID
        :return: All trips belonging to a user
        :rtype: list[dict]
        """
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("user_id", str(user_id))
                    .execute())
        return response.data

    def update_trip(self, trip_id: int) -> dict:
        """
        Update trip attributes (last modified in this case).

        :param trip_id: Trip ID
        :type trip_id: int
        :return: The updated trip data
        :rtype: dict
        """
        new_data = {
            "last_modified": str(datetime.now(timezone.utc))
        }

        response = (self.supabase.table("trips")
                    .update(new_data)
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None

    def delete_trip(self, trip_id: int) -> dict:
        """
        Delete a trip by its ID.

        :param trip_id: Trip ID
        :type trip_id: int
        :return: The trip that was deleted.
        :rtype: dict
        """
        response = (self.supabase.table("trips")
                    .delete()
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None