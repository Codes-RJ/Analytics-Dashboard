import { useState, useEffect } from 'react';
import api from '../services/api';

export const useDataset = (datasetId) => {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      fetchDataset();
    }
  }, [datasetId]);

  const fetchDataset = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/datasets/${datasetId}`);
      setDataset(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dataset');
    } finally {
      setLoading(false);
    }
  };

  return { dataset, loading, error, refetch: fetchDataset };
};