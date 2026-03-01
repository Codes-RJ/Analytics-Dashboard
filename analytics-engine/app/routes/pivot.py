from fastapi import APIRouter, HTTPException
import pandas as pd
from app.models.schemas import PivotRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def create_pivot_table(request: PivotRequest):
    """
    Create a pivot table from dataset
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Check if required columns exist
        for col in [request.index, request.columns, request.values]:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
        
        # Create pivot table
        pivot_table = pd.pivot_table(
            df,
            values=request.values,
            index=request.index,
            columns=request.columns,
            aggfunc=request.aggfunc,
            fill_value=0
        )
        
        # Convert to dict for JSON response
        result = {
            "index": list(pivot_table.index),
            "columns": list(pivot_table.columns),
            "data": pivot_table.to_dict(),
            "shape": pivot_table.shape
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))