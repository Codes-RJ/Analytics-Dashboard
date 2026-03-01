import pandas as pd
import numpy as np
from scipy import stats

def calculate_confidence_interval(data, confidence=0.95):
    """
    Calculate confidence interval for data
    """
    n = len(data)
    mean = np.mean(data)
    sem = stats.sem(data)
    interval = sem * stats.t.ppf((1 + confidence) / 2, n - 1)
    return {
        'mean': mean,
        'lower': mean - interval,
        'upper': mean + interval,
        'confidence': confidence
    }

def perform_ttest(group1, group2):
    """
    Perform t-test between two groups
    """
    t_stat, p_value = stats.ttest_ind(group1, group2)
    return {
        't_statistic': t_stat,
        'p_value': p_value,
        'significant': p_value < 0.05
    }

def perform_anova(groups):
    """
    Perform one-way ANOVA
    """
    f_stat, p_value = stats.f_oneway(*groups)
    return {
        'f_statistic': f_stat,
        'p_value': p_value,
        'significant': p_value < 0.05
    }

def calculate_moving_average(data, window=7):
    """
    Calculate moving average
    """
    return data.rolling(window=window).mean()

def calculate_exponential_smoothing(data, alpha=0.3):
    """
    Calculate exponential smoothing
    """
    return data.ewm(alpha=alpha).mean()