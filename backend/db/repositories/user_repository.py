from ..supabase_client import supabase

class UserRepository:
    @staticmethod
    def create_user(username: str, email: str, password: str, cookie: str = None):
        response = (supabase.table("Users")
                    .insert({
                        "Username": username,
                        "Email": email,
                        "Password": password,
                        "Cookie": cookie
                    }).execute())
        return response.data

    @staticmethod
    def get_user_by_id(user_id: int):
        response = (supabase.table("Users")
                    .select("*")
                    .eq("UserID", user_id)
                    .execute())
        return response.data[0] if response.data else None

    @staticmethod
    def get_user_by_email(email: str):
        response = (supabase.table("Users")
                    .select("*")
                    .eq("Email", email)
                    .execute())
        return response.data[0] if response.data else None