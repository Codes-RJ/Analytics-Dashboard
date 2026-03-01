from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from app.models.schemas import CorrelationRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def correlation_matrix(request: CorrelationRequest):
    """
    Calculate correlation matrix
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Select only numeric columns
        numeric_df = df.select_dtypes(include=[np.number])
        
        if request.columns:
            numeric_df = numeric_df[request.columns]
        
        # Calculate correlation
        corr_matrix = numeric_df.corr(method=request.method)
        
        # Convert to dict
        result = {}
        for col1 in corr_matrix.columns:
            result[col1] = {}
            for col2 in corr_matrix.index:
                val = corr_matrix.loc[col2, col1]
                result[col1][col2] = float(val) if not pd.isna(val) else None
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))