from fastapi import APIRouter, HTTPException
import pandas as pd
from app.models.schemas import TimeSeriesRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def time_series_analysis(request: TimeSeriesRequest):
    """
    Perform time series analysis
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Check if columns exist
        for col in [request.date_col, request.value_col]:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
        
        # Convert date column
        df[request.date_col] = pd.to_datetime(df[request.date_col])
        
        # Set date as index and resample
        df.set_index(request.date_col, inplace=True)
        
        # Resample data
        resampled = df[request.value_col].resample(request.freq).agg(['mean', 'sum', 'count'])
        
        # Fill missing values
        resampled = resampled.fillna(0)
        
        # Convert to records
        data = []
        for date, row in resampled.iterrows():
            data.append({
                "date": date.strftime('%Y-%m-%d'),
                "mean": float(row['mean']),
                "sum": float(row['sum']),
                "count": int(row['count'])
            })
        
        # Basic trend analysis
        if len(data) > 1:
            values = [d['mean'] for d in data if d['mean'] > 0]
            if values:
                trend = "increasing" if values[-1] > values[0] else "decreasing"
            else:
                trend = "stable"
        else:
            trend = "insufficient data"
        
        return {
            "freq": request.freq,
            "data": data,
            "trend": trend,
            "total_periods": len(data),
            "date_range": {
                "start": data[0]['date'] if data else None,
                "end": data[-1]['date'] if data else None
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))