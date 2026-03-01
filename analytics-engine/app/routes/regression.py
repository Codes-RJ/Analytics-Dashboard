from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
from app.models.schemas import RegressionRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def linear_regression(request: RegressionRequest):
    """
    Perform linear regression analysis
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Check if columns exist
        for col in [request.x, request.y]:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
        
        # Get data and drop NaN
        data = df[[request.x, request.y]].dropna()
        
        X = data[request.x].values.reshape(-1, 1)
        y = data[request.y].values
        
        # Perform regression
        model = LinearRegression()
        model.fit(X, y)
        
        # Make predictions
        y_pred = model.predict(X)
        
        # Calculate metrics
        r2 = r2_score(y, y_pred)
        mse = mean_squared_error(y, y_pred)
        rmse = np.sqrt(mse)
        
        # Get predictions for original data points
        predictions = [
            {"x": float(x), "actual": float(actual), "predicted": float(pred)}
            for x, actual, pred in zip(data[request.x], y, y_pred)
        ][:100]  # Limit to 100 points
        
        return {
            "coefficient": float(model.coef_[0]),
            "intercept": float(model.intercept_),
            "r2_score": float(r2),
            "mse": float(mse),
            "rmse": float(rmse),
            "n_observations": len(data),
            "equation": f"{request.y} = {model.coef_[0]:.4f} * {request.x} + {model.intercept_:.4f}",
            "predictions": predictions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))