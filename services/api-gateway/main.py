from fastapi import FastAPI
import requests

app = FastAPI()

DETECTION_URL = "http://detection:8000"
TRACKING_URL = "http://tracking:8000"

@app.get("/")
def root():
    return {"message": "API Gateway running"}

@app.get("/detect")
def detect():
    response = requests.get(f"{DETECTION_URL}/detect")
    return response.json()

@app.get("/track")
def track():
    response = requests.get(f"{TRACKING_URL}/track")
    return response.json()

@app.get("/pipeline")
def pipeline():
    detection_response = requests.get(f"{DETECTION_URL}/detect").json()
    tracking_response = requests.get(f"{TRACKING_URL}/track").json()

    return {
        "detection": detection_response,
        "tracking": tracking_response
    }