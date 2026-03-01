from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from app.models.schemas import MissingRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def handle_missing_values(request: MissingRequest):
    """
    Handle missing values in dataset
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Get missing value info before processing
        missing_before = df.isna().sum().to_dict()
        
        # Apply strategy
        if request.strategy == 'drop':
            df_cleaned = df.dropna()
        elif request.strategy == 'mean':
            df_cleaned = df.fillna(df.mean(numeric_only=True))
        elif request.strategy == 'median':
            df_cleaned = df.fillna(df.median(numeric_only=True))
        elif request.strategy == 'mode':
            df_cleaned = df.fillna(df.mode().iloc[0])
        elif request.strategy == 'fill_value':
            df_cleaned = df.fillna(request.fill_value)
        else:
            raise HTTPException(status_code=400, detail=f"Invalid strategy: {request.strategy}")
        
        # Get missing value info after processing
        missing_after = df_cleaned.isna().sum().to_dict()
        
        # Preview first 100 rows
        preview = df_cleaned.head(100).to_dict(orient='records')
        
        return {
            "rows_before": len(df),
            "rows_after": len(df_cleaned),
            "missing_before": {k: int(v) for k, v in missing_before.items() if v > 0},
            "missing_after": {k: int(v) for k, v in missing_after.items() if v > 0},
            "preview": preview
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))