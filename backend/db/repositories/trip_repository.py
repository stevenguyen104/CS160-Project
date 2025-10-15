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

    def create_trip(self, user_id: uuid.UUID, emissions: list[float] = None):
        response = (self.supabase.table("trips")
                    .insert({
                        "user_id": user_id,
                        "emissions": emissions or [0.0]
                    }).execute())
        return response.data

    def get_trip_by_id(self, trip_id: int):
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .execute())
        return response.data[0] if response.data else None

    def get_trips_for_user(self, user_id: uuid.UUID):
        response = (self.supabase.table("trips")
                    .select("*")
                    .eq("user_id", user_id)
                    .execute())
        return response.data

    def update_trip_emissions(self, trip_id: int, emissions: list[float] = None):
        response = (self.supabase.table("trips")
                    .update({
                        "emissions": emissions or [0.0]
                    }).eq("trip_id", trip_id)
                    .execute())
        return response.data
