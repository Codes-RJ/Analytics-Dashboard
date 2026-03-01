from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from app.models.schemas import StatisticsRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def descriptive_statistics(request: StatisticsRequest):
    """
    Calculate descriptive statistics for dataset
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Filter columns if specified
        if request.columns:
            df = df[request.columns]
        
        # Calculate statistics for numeric columns
        stats = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            stats[col] = {
                "mean": float(df[col].mean()) if not pd.isna(df[col].mean()) else None,
                "median": float(df[col].median()) if not pd.isna(df[col].median()) else None,
                "std": float(df[col].std()) if not pd.isna(df[col].std()) else None,
                "variance": float(df[col].var()) if not pd.isna(df[col].var()) else None,
                "min": float(df[col].min()) if not pd.isna(df[col].min()) else None,
                "max": float(df[col].max()) if not pd.isna(df[col].max()) else None,
                "count": int(df[col].count()),
                "missing": int(df[col].isna().sum()),
                "skewness": float(df[col].skew()) if not pd.isna(df[col].skew()) else None,
                "kurtosis": float(df[col].kurtosis()) if not pd.isna(df[col].kurtosis()) else None
            }
        
        # Add categorical columns info
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            stats[col] = {
                "unique_values": int(df[col].nunique()),
                "most_common": df[col].mode().iloc[0] if not df[col].mode().empty else None,
                "missing": int(df[col].isna().sum())
            }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def summary_statistics(request: StatisticsRequest):
    """
    Get pandas describe() output
    """
    try:
        df = load_dataframe(request.file_path)
        
        if request.columns:
            df = df[request.columns]
        
        # Get describe output
        describe_df = df.describe(include='all')
        
        # Convert to dict
        result = {}
        for col in describe_df.columns:
            result[col] = describe_df[col].to_dict()
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))