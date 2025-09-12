# 🔐 AnomalyGuard AI  
*AI for Detecting Anomalous Logins in Cloud Environments*  

---

## 📌 Overview  
**AnomalyGuard AI** is an AI-driven anomaly detection system that secures enterprise logins against credential theft.  
By analyzing login **geo-location, device fingerprints, and timestamps**, it detects subtle anomalies with **97% accuracy** while keeping false alerts low.  

---

## ⚠️ Problem Statement  
- Remote work and cloud adoption have amplified **credential theft risks**.  
- Traditional rule-based systems fail to detect anomalies like:  
  - 🚩 Impossible travel logins (two countries in minutes)  
  - 🚩 Suspicious device switching  
  - 🚩 Abnormal time-of-day logins  

---

## 💡 Our Solution  
AnomalyGuard AI ensures **real-time login protection**:  
1. **AI-Powered Analysis** – Learns user behavior and flags deviations.  
2. **Real-Time Response** – Triggers OTP challenges or access blocks.  
3. **Actionable Insights** – Dashboards with anomaly trends, risk levels, and heatmaps.  
4. **Compliance-Ready** – Downloadable reports for audits.  
5. **Future-Proof** – Roadmap includes browser extension for universal anomaly detection.  

---

## 🔄 Solution Flow  
1. **Data Ingestion** – Login logs (IP, device, timestamp, geo-location).  
2. **AI Analysis** – Logistic Regression model for anomaly scoring.  
3. **Visualization** – Heatmaps, timeline trends, risk segmentation.  
4. **Response** – OTP verification or access blocking.  
5. **Reporting** – Detailed compliance-ready reports.  

---

## 🛠️ Tech Stack  
- **Frontend**: React, TailwindCSS, Vite, TypeScript (.tsx)  
- **Backend**: Node.js, MongoDB  
- **ML Serving**: FastAPI  
- **ML Model**: Logistic Regression (best F1-score, robust against overfitting)  
- **Data Inputs**: IP addresses, geo-coordinates, device fingerprints, timestamps  

---

## 📊 Results  
- ✅ **Accuracy**: 97%  
- ✅ **ROC AUC**: 0.90  
- ✅ **Precision-Recall**: High performance for imbalanced anomaly datasets  
- ✅ **Low False Positives** – Less user disruption  
- ✅ **Low False Negatives** – Critical anomalies not missed  

---

## 🎯 Unique Features  
- 🔐 **Real-Time Login Protection** with OTP triggers  
- 📊 **Analyst Dashboard**: Heatmaps, risk levels, anomaly timeline  
- 🧠 **Voice-Enabled Chatbot** assistant for analysts  
- 📥 **Compliance-Ready Reports** for audits  
- ⚡ **Lightweight & Scalable** architecture  

---

## 🖼️ Visuals & Explanations  

### 1️⃣ System Architecture  
<img width="1047" height="932" alt="system architecture" src="https://github.com/user-attachments/assets/9b9a9d05-e8d2-420a-be14-61509b922475" />  

This diagram shows the **end-to-end flow**:  
- Logs from cloud platforms are ingested → analyzed by ML engine → anomalies flagged → real-time OTP/block triggered → analyst dashboard updated.  

---

### 2️⃣ Solution Flow Breakdown  
<img width="1028" height="814" alt="solution flow" src="https://github.com/user-attachments/assets/97f0d89c-97b9-444f-9962-6851127dea9e" />  

Step-by-step visualization of how data flows from ingestion → AI-powered anomaly detection → insights visualization → security actions.  

---

### 3️⃣ Confusion Matrix Results  
<img width="976" height="970" alt="confusion matrix" src="https://github.com/user-attachments/assets/5d26fd38-b13f-4db7-af1a-1fbef80c908e" />  

- **TN (1383)**: Correctly identified normal logins  
- **TP (68)**: Correctly detected anomalies  
- **FP & FN**: Very low, proving robustness  

This confirms high reliability in distinguishing normal vs. anomalous activity.  

---

### 4️⃣ Precision-Recall Curve  
<img width="1058" height="838" alt="precision recall" src="https://github.com/user-attachments/assets/a68b17d0-aae9-4009-821d-b187c1200d73" />  

- Shows strong balance of **precision vs recall**  
- Indicates high detection accuracy even in imbalanced anomaly datasets  
- Outperforms weaker models (Isolation Forest, KNN)  

---

### 5️⃣ Competitive Landscape  
<img width="1414" height="493" alt="competitive landscape" src="https://github.com/user-attachments/assets/a0b887db-6bbd-44ac-b001-2ef82837a02c" />  

Comparison with AWS CloudWatch, Azure Anomaly Detector, GCP BigQuery ML, Datadog, Darktrace, etc.  
👉 **Our Edge**: Lightweight, extensible design + downloadable compliance reporting + roadmap for browser extension.  

---

## 📺 Demo Walkthrough (Screenshots)  

### 🏠 Home Page  
![home](https://github.com/user-attachments/assets/80a4b24c-4e30-44cf-9b28-487e42460437)  

### 🔑 Login Page  
![login](https://github.com/user-attachments/assets/d065b92d-3327-4602-90ba-ffc5f17e00ee)  

### 📝 Sign Up Page  
![sign up](https://github.com/user-attachments/assets/50dbbc20-4484-4d48-a70f-b20cbb1634b9)  

### 🤖 Anomaly Detection (Detected)  
![anomaly detected](https://github.com/user-attachments/assets/925c0ae4-0ede-4a8d-9a53-46c3484b0d1d)  

### ✅ Normal Login (Not Detected)  
![not detected](https://github.com/user-attachments/assets/5b121b7d-35f1-4f2b-b536-7be4aa78194c)  

### 📂 Upload Data Logs  
![upload logs](https://github.com/user-attachments/assets/88ad3a4f-ef58-42ee-bae5-2799172608b7)  

### 📊 Dashboard Overview  
![dashboard](https://github.com/user-attachments/assets/ae433cae-b1af-4543-9009-5956895a43b7)  

### 🌍 Heatmap of Anomalies  
![heatmap](https://github.com/user-attachments/assets/a2bb842a-f75e-43b8-85c8-46c9255dd1b5)  

### 🚨 Flagged Users Table  
![flagged](https://github.com/user-attachments/assets/57cb29da-0e87-4ddc-ae7f-78ed5d57e654)  

---

## ⚙️ How to Run the Project  

### 🔽 Clone Repository  
```bash
git clone https://github.com/yourusername/AnomalyGuardAI.git
cd AnomalyGuardAI
````

### 📦 Install Dependencies

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### ML Model (FastAPI)

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app:main --reload
```

### ▶️ Access the App

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🚀 Next Steps

* Pilot testing with enterprise logs
* Reduce false positives further with adaptive thresholds
* Build **browser extension** for cross-platform anomaly detection

---

## 📚 References

* AWS SageMaker, Azure Anomaly Detector, Google BigQuery ML
* Industry reports on anomaly detection in cloud environments
* Academic research on adversarial defense strategies

---

## 🏆 Hackathon Value Proposition

* **Judges get clarity**: clear flow from problem → solution → results
* **Real-World Relevance**: addresses a pressing enterprise security issue
* **Technical Depth**: includes ML metrics, architecture, and demo
* **Future Potential**: roadmap ensures scalability and long-term impact


