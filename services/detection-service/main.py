from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Detection service is running"}

@app.get("/detect")
def detect():
    return {
        "detections": [
            {"object": "person", "confidence": 0.95}
        ]
    }