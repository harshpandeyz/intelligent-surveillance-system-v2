import motor.motor_asyncio
from dotenv import load_dotenv
import os
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("DB_URI", "mongodb://localhost:27017/cctv_ai")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
parsed = urlparse(MONGO_URI)
db_name = parsed.path.lstrip("/") or "cctv_ai"
db = client[db_name]

# Collections
events_collection = db["events"]
users_collection = db["users"]  # ✅ Add this line
