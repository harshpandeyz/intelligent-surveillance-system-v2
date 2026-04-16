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
* 🧠 AI-based mob detection (YOLOv8 ready)
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

\

---

### ⚙️ Backend & APIs

\

---

### 🐳 DevOps & Infrastructure


\

---

### 🗄️ Database (Planned)

---

### ⛓️ Blockchain (Planned)

\

---

### 🎨 Frontend (Planned)

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

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it helps a lot!
