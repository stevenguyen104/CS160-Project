from ..supabase_client import supabase
from supabase import Client

class UserRepository:
    def __init__(self, supabase_client: Client):
        """
        Initialize the user repository with a Supabase client.

        :param supabase_client: Supabase client instance
        :type supabase_client: Client
        """
        self.supabase = supabase_client

    def create_user(self, username: str, email: str, password: str) -> dict | None:
        """
        Create a new user in the database if not taken.

        :param username: The username for the user
        :type username: str
        :param email: The email for the user
        :type email: str
        :param password: The hashed password for the user
        :type password: str
        :return: The created user as returned by Supabase
        :rtype: dict or None
        """
        response = (self.supabase.table("users")
                    .insert({
                        "username": username,
                        "email": email,
                        "password": password
                    }).execute())
        return response.data

    def get_user_by_id(self, user_id: int) -> dict | None:
        """
        Get a user by its ID.

        :param user_id: The auto-generated ID of the user
        :type user_id: int
        :return: The user as returned by Supabase
        :rtype: dict or None
        """
        response = (self.supabase.table("users")
                    .select("*")
                    .eq("user_id", user_id)
                    .execute())
        return response.data[0] if response.data else None

    def get_user_by_email(self, email: str) -> dict | None:
        """
        Get a user by its email.

        :param email: The email for the user
        :type email: str
        :return: The user as returned by Supabase
        :rtype: dict or None
        """
        response = (self.supabase.table("users")
                    .select("*")
                    .eq("email", email)
                    .execute())
        return response.data[0] if response.data else None

    def get_user_by_username(self, username: str) -> dict | None:
        """
        Get a user by its username.

        :param username: The username for the user
        :type username: str
        :return: The user as returned by Supabase
        :rtype: dict or None
        """
        response = (self.supabase.table("users")
                    .select("*")
                    .eq("username", username)
                    .execute()
                    .first())
        return response.data[0] if response.data else None
