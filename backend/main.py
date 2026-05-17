from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from contextlib import asynccontextmanager
import os as _os
from bson import ObjectId

from backend.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    hash_password,
    ensure_admin,
    get_current_admin_user,
)

from backend.database import users_collection, events_collection
from backend.blockchain import log_event_on_chain
from backend.routes import live_stream

import json
import os
import aiofiles
import uuid
from datetime import datetime

from AI.detect_clip_upload import analyze_clip_full


def serialize_doc(doc):
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_admin()
    yield


# ----------------------------
# App Init
# ----------------------------
app = FastAPI(title="Mob Surveillance System API", lifespan=lifespan)

_raw_origins = _os.getenv("ALLOWED_ORIGINS", "")
_extra_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8154",
        "http://127.0.0.1:8154",
        "http://localhost:8153",
        "http://127.0.0.1:8153",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ] + _extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(live_stream.router)

# ----------------------------
# Auth Models
# ----------------------------
class UserSignup(BaseModel):
    username: str
    password: str


# ----------------------------
# Signup
# ----------------------------
@app.post("/signup")
async def signup(user: UserSignup):
    existing_user = await users_collection.find_one({"username": user.username})

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hash_password(user.password)

    await users_collection.insert_one({
        "username": user.username,
        "hashed_password": hashed_pw,
        "role": "user"
    })

    return {
        "status": "success",
        "message": "User created successfully"
    }


# ----------------------------
# Login
# ----------------------------
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(
        form_data.username,
        form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        data={"sub": user["username"]}
    )

    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "username": user["username"],
        "role": user["role"]
    }


# ----------------------------
# AI Upload + Classify + Blockchain
# ----------------------------
@app.post("/classify_upload")
async def classify_and_log_event(
    camera_id: str = Form(...),
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    try:
        # Save uploaded video
        os.makedirs("storage", exist_ok=True)

        raw_filename = f"{camera_id}_{uuid.uuid4().hex}.mp4"
        raw_path = os.path.join("storage", raw_filename)

        async with aiofiles.open(raw_path, "wb") as f:
            await f.write(await file.read())

        # AI Detection
        result = analyze_clip_full(
            camera_id,
            raw_path,
            skip_post=True
        )

        record = result.copy()
        record["tx_hash"] = "pending"
        record["user"] = user["username"]
        record["created_at"] = datetime.utcnow()

        # Save MongoDB
        res = await events_collection.insert_one(record)
        doc_id = res.inserted_id

        # Blockchain
        try:
            metadata = json.dumps(result)

            tx_hash = log_event_on_chain(
                result["hash"],
                metadata,
                enc_file_path=result["enc_path"]
            )

            await events_collection.update_one(
                {"_id": doc_id},
                {"$set": {"tx_hash": tx_hash}}
            )

            record["tx_hash"] = tx_hash

        except Exception as e:
            print("[BLOCKCHAIN ERROR]", e)

        return {
            "status": "success",
            "event_type": record.get("event_type"),
            "confidence": record.get("confidence"),
            "tx_hash": record["tx_hash"]
        }

    except Exception as e:
        print("[UPLOAD ERROR]", e)
        return {
            "status": "error",
            "message": str(e)
        }


# ----------------------------
# Manual Event Entry
# ----------------------------
class EventModel(BaseModel):
    camera_id: str
    event_type: str
    confidence: float
    start_time: str
    end_time: str
    clip_path: str
    enc_path: str
    hash: str


@app.post("/event")
async def log_event(
    event: EventModel,
    user: dict = Depends(get_current_user)
):
    try:
        record = event.model_dump() if hasattr(event, "model_dump") else event.dict()
        record["tx_hash"] = "pending"
        record["user"] = user["username"]
        record["created_at"] = datetime.utcnow()

        res = await events_collection.insert_one(record)
        doc_id = res.inserted_id

        try:
            metadata = json.dumps(serialize_doc(record))

            tx_hash = log_event_on_chain(
                event.hash,
                metadata,
                enc_file_path=event.enc_path
            )

            await events_collection.update_one(
                {"_id": doc_id},
                {"$set": {"tx_hash": tx_hash}}
            )

            record["tx_hash"] = tx_hash

        except Exception as e:
            print("[BLOCKCHAIN ERROR]", e)

        return {
            "status": "success",
            "tx_hash": record["tx_hash"]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ----------------------------
# Get Events
# ----------------------------
@app.get("/events")
async def get_all_events(
    user: dict = Depends(get_current_user)
):
    query = {} if user["role"] == "admin" else {
        "user": user["username"]
    }

    events = []

    async for doc in events_collection.find(query):
        events.append(serialize_doc(doc))

    return {
        "count": len(events),
        "events": events
    }


# ----------------------------
# Admin Dashboard
# ----------------------------
@app.get("/admin-dashboard")
async def get_admin_dashboard(
    user: dict = Depends(get_current_admin_user)
):
    return {
        "message": f"Welcome Admin {user['username']}"
    }


