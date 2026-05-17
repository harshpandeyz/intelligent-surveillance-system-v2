import os
import asyncio
import cv2
import numpy as np
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

CAMERA_SOURCE = os.getenv("CAMERA_SOURCE", "0")


def _try_int(s):
    try:
        return int(s)
    except (ValueError, TypeError):
        return s


def _blank_frame_bytes():
    blank = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(
        blank,
        "No Camera Available",
        (100, 240),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (255, 255, 255),
        2,
    )
    _, buf = cv2.imencode(".jpg", blank)
    return b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buf.tobytes() + b"\r\n"


async def generate_frames():
    source = _try_int(CAMERA_SOURCE)
    loop = asyncio.get_event_loop()
    cap = await loop.run_in_executor(None, cv2.VideoCapture, source)

    if not cap.isOpened():
        blank_bytes = _blank_frame_bytes()
        while True:
            yield blank_bytes
            await asyncio.sleep(0.5)
        return

    try:
        while True:
            success, frame = await loop.run_in_executor(None, cap.read)
            if not success:
                break
            _, buffer = cv2.imencode(".jpg", frame)
            yield (
                b"--frame\r\nContent-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )
            await asyncio.sleep(0.033)
    finally:
        await loop.run_in_executor(None, cap.release)


@router.get("/live_feed")
async def live_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )
