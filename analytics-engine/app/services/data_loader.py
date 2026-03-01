import pandas as pd
import os
from fastapi import HTTPException

def load_dataframe(file_path: str) -> pd.DataFrame:
    """
    Load dataframe from file path based on extension
    """
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    
    try:
        if file_path.endswith('.csv'):
            return pd.read_csv(file_path)
        elif file_path.endswith(('.xlsx', '.xls')):
            return pd.read_excel(file_path)
        elif file_path.endswith('.parquet'):
            return pd.read_parquet(file_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file format: {file_path}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading file: {str(e)}")