from ..supabase_client import supabase

class StopRepository:
    @staticmethod
    def add_stop(trip_id: int, latitude: int, longitude: int, name: str, position: int):
        response = (supabase.table("Stops")
                    .insert({
                        "TripID": trip_id,
                        "Latitude": latitude,
                        "Longitude": longitude,
                        "Name": name,
                        "Position": position
                    }).execute())
        return response.data

    @staticmethod
    def get_stops_for_trip(trip_id: int):
        response = (supabase.table("Stops")
                    .select("*")
                    .eq("TripID", trip_id)
                    .order("Position")
                    .execute())
        return response.data

    @staticmethod
    def delete_stop(stop_id: int):
        (supabase.table("Stops")
         .delete()
         .eq("StopID", stop_id)
         .execute())
        return True

    @staticmethod
    def update_stop_position(stop_id: int, new_position: int):
        response = (supabase.table("Stops")
                    .update({
                        "Position": new_position
                    }).eq("StopID", stop_id)
                    .execute())
        return response.data