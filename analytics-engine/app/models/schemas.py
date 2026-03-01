from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DataRequest(BaseModel):
    file_path: str
    page: int = 1
    limit: int = 50
    sort: Optional[str] = None
    order: str = "asc"
    filters: Dict[str, Any] = {}

class StatisticsRequest(BaseModel):
    file_path: str
    columns: Optional[List[str]] = None

class CorrelationRequest(BaseModel):
    file_path: str
    method: str = "pearson"  # pearson, spearman, kendall
    columns: Optional[List[str]] = None

class RegressionRequest(BaseModel):
    file_path: str
    x: str
    y: str

class PivotRequest(BaseModel):
    file_path: str
    index: str
    columns: str
    values: str
    aggfunc: str = "mean"

class TimeSeriesRequest(BaseModel):
    file_path: str
    date_col: str
    value_col: str
    freq: str = "D"  # D=day, W=week, M=month

class OutlierRequest(BaseModel):
    file_path: str
    column: str
    method: str = "zscore"  # zscore, iqr
    threshold: float = 3.0

class MissingRequest(BaseModel):
    file_path: str
    strategy: str = "drop"  # drop, mean, median, mode, fill_value
    fill_value: Optional[Any] = None

class QueryRequest(BaseModel):
    file_path: str
    query: str  # pandas query string

class ExportRequest(BaseModel):
    file_path: str
    format: str = "csv"  # csv, xlsx, json