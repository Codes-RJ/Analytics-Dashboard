import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLayouts();
      fetchDatasets();
    }
  }, [isAuthenticated]);

  const fetchLayouts = async () => {
    try {
      const { data } = await api.get('/layouts');
      setLayouts(data);
      if (data.length > 0 && !currentLayout) {
        setCurrentLayout(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch layouts');
    }
  };

  const fetchDatasets = async () => {
    try {
      const { data } = await api.get('/datasets');
      setDatasets(data.datasets);
    } catch (error) {
      toast.error('Failed to fetch datasets');
    }
  };

  const saveLayout = async (layout) => {
    try {
      if (layout.id) {
        await api.put(`/layouts/${layout.id}`, layout);
        toast.success('Layout updated');
      } else {
        const { data } = await api.post('/layouts', layout);
        setLayouts([...layouts, data]);
        toast.success('Layout saved');
      }
      fetchLayouts();
    } catch (error) {
      toast.error('Failed to save layout');
    }
  };

  const deleteLayout = async (id) => {
    try {
      await api.delete(`/layouts/${id}`);
      setLayouts(layouts.filter(l => l.id !== id));
      if (currentLayout?.id === id) {
        setCurrentLayout(layouts[0] || null);
      }
      toast.success('Layout deleted');
    } catch (error) {
      toast.error('Failed to delete layout');
    }
  };

  const value = {
    layouts,
    currentLayout,
    setCurrentLayout,
    saveLayout,
    deleteLayout,
    selectedDataset,
    setSelectedDataset,
    datasets,
    fetchDatasets,
    loading
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;