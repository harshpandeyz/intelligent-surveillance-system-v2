from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

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

import json
import os
import aiofiles
import uuid
from datetime import datetime

from AI.detect_clip_upload import analyze_clip_full

# ----------------------------
# App Init
# ----------------------------
app = FastAPI(title="CCTV-AI Blockchain API")

# ----------------------------
# FULL CORS FIX
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        record = event.dict()
        record["tx_hash"] = "pending"
        record["user"] = user["username"]
        record["created_at"] = datetime.utcnow()

        res = await events_collection.insert_one(record)
        doc_id = res.inserted_id

        try:
            metadata = json.dumps(record)

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

    async for doc in events_collection.find(query, {"_id": 0}):
        events.append(doc)

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


# ----------------------------
# Startup
# ----------------------------
@app.on_event("startup")
async def startup_event():
    await ensure_admin()


# ----------------------------
# Live Stream Routes
# ----------------------------
from backend.routes import live_stream
app.include_router(live_stream.router)