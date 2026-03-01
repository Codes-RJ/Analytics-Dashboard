from fastapi import APIRouter, HTTPException
import pandas as pd
import os
from app.models.schemas import DataRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def get_data(request: DataRequest):
    """
    Get paginated data from dataset
    """
    try:
        # Load dataframe
        df = load_dataframe(request.file_path)
        
        # Apply filters
        for col, val in request.filters.items():
            if col in df.columns:
                if df[col].dtype == 'object':
                    df = df[df[col].astype(str).str.contains(val, case=False, na=False)]
                else:
                    df = df[df[col] == val]
        
        # Apply sorting
        if request.sort and request.sort in df.columns:
            ascending = request.order.lower() == "asc"
            df = df.sort_values(by=request.sort, ascending=ascending)
        
        # Pagination
        total = len(df)
        start = (request.page - 1) * request.limit
        end = start + request.limit
        
        # Convert to records
        data = df.iloc[start:end].to_dict(orient='records')
        
        return {
            "data": data,
            "total": total,
            "page": request.page,
            "limit": request.limit,
            "columns": list(df.columns)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))