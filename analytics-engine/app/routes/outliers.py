from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from scipy import stats
from app.models.schemas import OutlierRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def detect_outliers(request: OutlierRequest):
    """
    Detect outliers in a column using specified method
    """
    try:
        df = load_dataframe(request.file_path)
        
        if request.column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{request.column}' not found")
        
        # Get numeric data
        data = df[request.column].dropna()
        
        if not pd.api.types.is_numeric_dtype(data):
            raise HTTPException(status_code=400, detail=f"Column '{request.column}' is not numeric")
        
        outliers = []
        outlier_indices = []
        
        if request.method == 'zscore':
            # Z-score method
            z_scores = np.abs(stats.zscore(data))
            outlier_indices = np.where(z_scores > request.threshold)[0]
            outliers = data.iloc[outlier_indices].tolist()
            
        elif request.method == 'iqr':
            # IQR method
            Q1 = data.quantile(0.25)
            Q3 = data.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outlier_indices = data[(data < lower_bound) | (data > upper_bound)].index
            outliers = data.loc[outlier_indices].tolist()
            
        else:
            raise HTTPException(status_code=400, detail=f"Invalid method: {request.method}")
        
        return {
            "column": request.column,
            "method": request.method,
            "threshold": request.threshold,
            "total_rows": len(data),
            "outliers_count": len(outliers),
            "outliers": outliers[:100],  # Limit to first 100
            "outlier_indices": outlier_indices[:100].tolist() if hasattr(outlier_indices, 'tolist') else list(outlier_indices)[:100],
            "stats": {
                "mean": float(data.mean()),
                "std": float(data.std()),
                "min": float(data.min()),
                "max": float(data.max()),
                "q1": float(data.quantile(0.25)),
                "q3": float(data.quantile(0.75))
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))