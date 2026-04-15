from fastapi import FastAPI
import requests

app = FastAPI()

DETECTION_URL = "http://detection:8000"

@app.get("/")
def root():
    return {"message": "API Gateway running"}

@app.get("/detect")
def detect():
    response = requests.get(f"{DETECTION_URL}/detect")
    return response.json()