import os
from dotenv import load_dotenv
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir, '.env'))
load_dotenv(dotenv_path=dotenv_path)
