# 🚀 Intelligent Mob Surveillance System using AI, DevOps & Blockchain

An AI-powered intelligent CCTV surveillance framework designed to automatically detect suspicious mob activities in real-time and ensure **tamper-proof storage of digital evidence** using blockchain-based cryptographic security.

---

## 🌐 Live System (Local DevOps Deployment)

```bash
http://localhost:8000
```

---

## 📌 Problem Statement

Traditional CCTV surveillance systems depend on continuous human monitoring and use centralized storage systems where video evidence can be modified, deleted, or tampered with.

This compromises the reliability of digital forensic evidence.

The **Intelligent Mob Surveillance System (IMS)** solves this by integrating:

* 🤖 Artificial Intelligence (real-time detection)
* ⚙️ DevOps (automated deployment)
* 🔐 Blockchain (tamper-proof evidence storage)

---

## 🔥 Key Features

* 🎥 Real-time CCTV / webcam monitoring
* 🧠 AI-based mob detection (YOLOv8)
* 📊 Person counting & crowd analysis
* 🚨 Suspicious activity detection (threshold-based)
* 🔐 AES-256 encryption of video evidence
* 🧾 SHA-256 hash generation
* ⛓️ Blockchain-based immutable logging
* 🔄 CI/CD automated deployment (Jenkins + Docker)
* 🌐 API-based microservices architecture

---

## 🧱 System Architecture

```
Camera / Video Input
        ↓
Detection Service (YOLOv8)
        ↓
Tracking Service (DeepSORT)
        ↓
Action Service (Mob Detection Logic)
        ↓
Encryption & Hashing
        ↓
Blockchain Logging (Ethereum)
        ↓
API Gateway
        ↓
Frontend Dashboard (Future)
```

---

## ⚙️ DevOps Pipeline

```
GitHub → Jenkins → Docker Build → Container Deployment → Running System
```

✔ Automated build & deployment
✔ Container lifecycle management
✔ Microservice orchestration

---

## 🧰 Tech Stack

### 🤖 AI & Computer Vision

* YOLOv8 (Ultralytics)
* OpenCV
* NumPy
* DeepSORT (for tracking - upcoming)

---

### ⚙️ Backend & APIs

* FastAPI
* Python 3.10+
* REST API Architecture
* Uvicorn (ASGI server)

---

### 🐳 DevOps & Infrastructure

* Docker
* Docker Compose
* Jenkins (CI/CD Pipeline)
* GitHub (Version Control)

---

### 🗄️ Database (Planned)

* PostgreSQL / MongoDB (for logs & metadata)
* Redis (for caching / streaming optimization)

---

### ⛓️ Blockchain (Planned)

* Ethereum
* Web3.py
* Smart Contracts (Solidity)
* IPFS (optional for decentralized storage)

---

### 🎨 Frontend (Planned)

* React.js
* Tailwind CSS
* Chart.js / Recharts (for analytics dashboard)

---

## 📁 Project Structure

```
intelligent-surveillance-system/
│
├── services/
│   ├── detection-service/
│   ├── tracking-service/
│   ├── action-service/
│   └── api-gateway/
│
├── models/
│   ├── yolov8/
│   └── deepsort/
│
├── ci-cd/
│   └── Jenkinsfile
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
│
├── configs/
├── pipelines/
├── scripts/
├── tests/
├── docs/
│
├── docker-compose.yml
├── README.md
└── requirements.txt
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/harshpandeyz/intelligent-surveillance-system-v2.git
cd intelligent-surveillance-system
```

---

### 2️⃣ Run using Docker

```bash
docker-compose up --build
```

---

### 3️⃣ Access Services

* API Gateway → http://localhost:8000
* Detection → http://localhost:8001
* Tracking → http://localhost:8002
* Action → http://localhost:8003

---

## 🔄 API Endpoints

| Endpoint    | Description          |
| ----------- | -------------------- |
| `/detect`   | Detection service    |
| `/track`    | Tracking service     |
| `/analyze`  | Action service       |
| `/pipeline` | Full system pipeline |

---

## 🧠 Current Status

| Component      | Status         |
| -------------- | -------------- |
| Microservices  | ✅ Complete     |
| Docker Setup   | ✅ Complete     |
| CI/CD Pipeline | ✅ Complete     |
| AI Integration | 🚧 In Progress |
| Blockchain     | 🚧 Planned     |
| Frontend       | 🚧 Planned     |

---

## 📬 Contact Me

* 👤 Name: Harsh Pandey
* 📧 Email: [harshpandeyz@gmail.com](mailto:harshpandeyz@gmail.com) *(replace if needed)*
* 🔗 GitHub: https://github.com/harshpandeyz
* 💼 LinkedIn: https://www.linkedin.com/in/harshpandeyz *(update if needed)*

---

## ⭐ Support

If you found this project useful:

* Give it a ⭐ on GitHub
* Share it with others
* Contribute to improve it

---

## 📌 Future Enhancements

* Real-time CCTV RTSP stream support
* Advanced crowd behavior analysis
* Face recognition module
* Cloud deployment (AWS / GCP / Azure)
* Kubernetes orchestration
* Full frontend dashboard

---

## ⚠️ Disclaimer

This project is for educational and research purposes. Ensure compliance with local surveillance and privacy laws before deploying in real-world environments.

---

## Project Overview
AI-powered CCTV surveillance with blockchain evidence logging.

## Tech Stack
- YOLOv8, FastAPI, MongoDB, Web3.py, React, Vite

## Features
- Real-time object detection via YOLOv8
