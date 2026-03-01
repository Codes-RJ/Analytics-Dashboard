from fastapi import APIRouter, HTTPException
import pandas as pd
from app.models.schemas import QueryRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def execute_query(request: QueryRequest):
    """
    Execute custom pandas query on dataset
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Execute query
        result_df = df.query(request.query)
        
        # Get results
        total_rows = len(result_df)
        preview = result_df.head(100).to_dict(orient='records')
        
        return {
            "query": request.query,
            "total_rows": total_rows,
            "preview": preview,
            "columns": list(result_df.columns)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))