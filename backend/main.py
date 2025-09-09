from fastapi import FastAPI, UploadFile, File
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev use, restrict in production
    allow_methods=["*"],
    allow_headers=["*"]
)

# Severity thresholds
def calculate_severity(count: int) -> str:
    if count > 1000:
        return "High"
    elif count > 500:
        return "Medium"
    else:
        return "Low"

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Read CSV in chunks to handle large files
    chunks = pd.read_csv(file.file, chunksize=10000)
    df = pd.concat(chunks)

    # Assuming your dataset has a column 'region'
    summary = df.groupby("region").size().reset_index(name="count")
    summary["severity"] = summary["count"].apply(calculate_severity)
    summary["avgScore"] = 0  # placeholder, can be filled if backend calculates scores

    return {"regionalData": summary.to_dict(orient="records")}
