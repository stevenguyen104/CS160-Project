from supabase import Client

class StopRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the user repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase = supabase_client

    def add_stop(self, trip_id: int, latitude: float, longitude: float, name: str, stop_order: int = None):
        response = (self.supabase.table("stops")
                    .insert({
                        "trip_id": trip_id,
                        "latitude": latitude,
                        "longitude": longitude,
                        "name": name,
                        "stop_order": stop_order
                    }).execute())
        return response.data

    def get_stops_for_trip(self, trip_id: int):
        response = (self.supabase.table("stops")
                    .select("*")
                    .eq("trip_id", trip_id)
                    .order("stop_order")
                    .execute())
        return response.data

    def delete_stop(self, stop_id: int):
        response = (self.supabase.table("stops")
             .delete()
             .eq("stop_id", stop_id)
             .execute())
        return response.data

    def update_stop_order(self, stop_id: int, new_order: int):
        response = (self.supabase.table("stops")
                    .update({
                        "stop_order": new_order
                    }).eq("stop_id", stop_id)
                    .execute())
        return response.data
