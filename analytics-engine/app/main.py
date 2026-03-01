from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import (
    statistics, correlation, regression, pivot, timeseries,
    outliers, missing, query, data, export
)

load_dotenv()

app = FastAPI(
    title="Analytics Engine",
    description="High-performance data analytics engine using Pandas/NumPy",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
app.include_router(correlation.router, prefix="/correlation", tags=["correlation"])
app.include_router(regression.router, prefix="/regression", tags=["regression"])
app.include_router(pivot.router, prefix="/pivot", tags=["pivot"])
app.include_router(timeseries.router, prefix="/timeseries", tags=["timeseries"])
app.include_router(outliers.router, prefix="/outliers", tags=["outliers"])
app.include_router(missing.router, prefix="/missing", tags=["missing"])
app.include_router(query.router, prefix="/query", tags=["query"])
app.include_router(data.router, prefix="/data", tags=["data"])
app.include_router(export.router, prefix="/export", tags=["export"])

@app.get("/")
async def root():
    return {
        "service": "Analytics Engine",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}