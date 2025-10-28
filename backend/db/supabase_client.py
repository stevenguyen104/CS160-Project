from supabase import create_client, Client

import backend

url: str = backend.SUPABASE_URL
key: str = backend.SUPABASE_KEY

if not url or not key:
    raise ValueError("Missing Supabase environment variables.")

supabase: Client = create_client(url, key)
