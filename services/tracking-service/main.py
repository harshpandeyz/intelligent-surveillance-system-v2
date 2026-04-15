from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Tracking service running"}

@app.get("/track")
def track():
    return {
        "tracks": [
            {"id": 1, "object": "person", "status": "tracked"}
        ]
    }