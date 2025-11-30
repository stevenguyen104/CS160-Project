from supabase import create_client, Client

from backend import SUPABASE_KEY, SUPABASE_URL

url: str = SUPABASE_URL
key: str = SUPABASE_KEY

if not url or not key:
    raise ValueError("Missing Supabase environment variables.")

supabase: Client = create_client(url, key)

__all__ = ["supabase"]
