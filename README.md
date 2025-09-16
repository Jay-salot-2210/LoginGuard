# 🔐 LoginGuard (AnomalyGuard AI)

AI-driven anomaly detection system for securing cloud logins against credential theft and unauthorized access.  
By analyzing **geo-location, device fingerprints, and login timestamps**, LoginGuard detects subtle anomalies in real time and proactively safeguards enterprise systems.

---

## 🚀 Features

- **AI-Powered Anomaly Detection**  
  Uses a Logistic Regression model to learn normal login patterns and flag suspicious logins.  

- **Real-Time Response**  
  Challenges risky logins with OTP verification or blocks access instantly.  

- **Interactive Dashboard**  
  Provides analysts with:
  - 🌍 Geographic heatmaps  
  - 📊 Risk segmentation (High, Medium, Low)  
  - ⏱ Timeline anomaly trends  
  - 📑 Downloadable reports  

- **Scalable Backend**  
  Built with **Node.js, MongoDB, FastAPI** for high-performance data handling and ML inference.  

- **Future-Proof Roadmap**  
  Browser extension support for anomaly detection across all web applications.  

---

## 🏗️ Tech Stack

- **Frontend**: React, TailwindCSS, Vite, TypeScript  
- **Backend**: Node.js, MongoDB  
- **Machine Learning**: FastAPI, Logistic Regression (scikit-learn)  
- **Data Inputs**: IP addresses, geo-coordinates, device fingerprints, timestamps  

---

## 📂 Project Structure



LoginGuard/
│── frontend/         # React + Tailwind dashboard
│── backend/          # Node.js + MongoDB APIs
│── ml-model/         # FastAPI service for anomaly detection
│── data/             # Sample login logs (CSV/JSON)
│── reports/          # Generated anomaly reports


## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Jay-salot-2210/LoginGuard.git
cd LoginGuard
````

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
npm start
```

### 4. ML Service Setup

```bash
cd ml-model
pip install -r requirements.txt
uvicorn app:app --reload
```

---

## 📊 Model Performance

* **Accuracy**: \~97%
* **AUC-ROC**: 0.90
* **Precision-Recall**: High robustness on imbalanced login datasets
* Optimized for **low false positives** and **high anomaly recall**.

---

## 🔮 Future Roadmap

* Browser extension for anomaly detection across all websites.
* Real-time adaptive learning models.
* Seamless integration with SIEM/SOC platforms.

---

## 🤝 Contributors

* **Purav Shah**
* **Neel Shah**
* **Jaimin Trivedi**
* **Jay Salot**
* **Nigam Sanghvi**

---

## 📜 License

This project is licensed under the MIT License.

---

## 🌐 Demo / PPT

* [Project Presentation (PPT)](./docs/AnomalyGuard-AI.pptx)
* [GitHub Repository](https://github.com/Jay-salot-2210/LoginGuard)
