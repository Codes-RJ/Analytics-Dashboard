import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder

def normalize_data(df, columns=None, method='standard'):
    """
    Normalize numeric data
    """
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns
    
    result_df = df.copy()
    
    if method == 'standard':
        scaler = StandardScaler()
        result_df[columns] = scaler.fit_transform(df[columns])
    elif method == 'minmax':
        scaler = MinMaxScaler()
        result_df[columns] = scaler.fit_transform(df[columns])
    
    return result_df

def encode_categorical(df, columns=None, method='onehot'):
    """
    Encode categorical variables
    """
    if columns is None:
        columns = df.select_dtypes(include=['object']).columns
    
    result_df = df.copy()
    
    if method == 'label':
        for col in columns:
            le = LabelEncoder()
            result_df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
    elif method == 'onehot':
        result_df = pd.get_dummies(result_df, columns=columns)
    
    return result_df

def remove_duplicates(df, subset=None):
    """
    Remove duplicate rows
    """
    return df.drop_duplicates(subset=subset)

def handle_outliers(df, column, method='iqr', threshold=1.5):
    """
    Handle outliers in a column
    """
    if column not in df.columns:
        return df
    
    data = df[column].dropna()
    
    if method == 'iqr':
        Q1 = data.quantile(0.25)
        Q3 = data.quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - threshold * IQR
        upper_bound = Q3 + threshold * IQR
        outliers = (data < lower_bound) | (data > upper_bound)
        df.loc[outliers, column] = np.nan
    
    return df