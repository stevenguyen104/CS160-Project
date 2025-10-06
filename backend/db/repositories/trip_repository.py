from ..supabase_client import supabase

class TripRepository:
    @staticmethod
    def create_trip(user_id: int, emissions: float = 0.0):
        response = (supabase.table("Trips")
                    .insert({
                        "UserID": user_id,
                        "Emissions": emissions
                    }).execute())
        return response.data

    @staticmethod
    def get_trip_by_id(trip_id: int):
        response = (supabase.table("Trips")
                    .select("*")
                    .eq("TripID", trip_id)
                    .execute())
        return response.data[0] if response.data else None

    @staticmethod
    def get_trips_for_user(user_id: int):
        response = (supabase.table("Trips")
                    .select("*")
                    .eq("UserID", user_id)
                    .execute())
        return response.data

    @staticmethod
    def update_trip_emissions(trip_id: int, emissions: float):
        response = (supabase.table("Trips")
                    .update({
                        "Emissions": emissions
                    }).eq("TripID", trip_id)
                    .execute())
        return response.data