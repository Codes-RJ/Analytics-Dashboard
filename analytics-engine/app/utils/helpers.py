import pandas as pd
import numpy as np
import json
from datetime import datetime

def convert_numpy_types(obj):
    """
    Convert numpy types to Python native types for JSON serialization
    """
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif isinstance(obj, pd.Series):
        return obj.to_dict()
    elif isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient='records')
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

def validate_file_size(file_size, max_size_mb=100):
    """
    Validate file size
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes

def detect_file_encoding(file_path):
    """
    Detect file encoding
    """
    import chardet
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read(10000))
    return result['encoding']

def chunk_list(lst, chunk_size):
    """
    Split list into chunks
    """
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def safe_divide(a, b, default=0):
    """
    Safe division to avoid division by zero
    """
    try:
        return a / b if b != 0 else default
    except:
        return default