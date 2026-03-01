import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import KpiCard from '../components/dashboard/KpiCard';
import ChartPanel from '../components/dashboard/ChartPanel';
import DataTable from '../components/dashboard/DataTable';
import LayoutSelector from '../components/dashboard/LayoutSelector';
import api from '../services/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const { 
    currentLayout, 
    setCurrentLayout, 
    saveLayout, 
    selectedDataset,
    setSelectedDataset,
    datasets 
  } = useDashboard();
  
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDataset) {
      fetchKpiData();
    }
  }, [selectedDataset]);

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/analytics/descriptive', { 
        datasetId: selectedDataset.id 
      });
      setKpiData(data);
    } catch (error) {
      console.error('Failed to fetch KPI data', error);
    } finally {
      setLoading(false);
    }
  };

  const onLayoutChange = (layout) => {
    if (currentLayout) {
      const updatedLayout = { ...currentLayout, layout };
      setCurrentLayout(updatedLayout);
      // Debounced save
      const timeout = setTimeout(() => saveLayout(updatedLayout), 1000);
      return () => clearTimeout(timeout);
    }
  };

  const handleChartTypeChange = (itemId, chartType) => {
    if (currentLayout) {
      const updatedItems = currentLayout.layout.map(item => 
        item.i === itemId ? { ...item, chartType } : item
      );
      const updatedLayout = { ...currentLayout, layout: updatedItems };
      setCurrentLayout(updatedLayout);
      saveLayout(updatedLayout);
    }
  };

  const defaultLayout = [
    { i: '1', x: 0, y: 0, w: 4, h: 2, title: 'Chart 1', chartType: 'line' },
    { i: '2', x: 4, y: 0, w: 4, h: 2, title: 'Chart 2', chartType: 'bar' },
    { i: '3', x: 8, y: 0, w: 4, h: 2, title: 'Chart 3', chartType: 'pie' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <select
            value={selectedDataset?.id || ''}
            onChange={(e) => {
              const dataset = datasets.find(d => d.id === e.target.value);
              setSelectedDataset(dataset);
            }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">Select Dataset</option>
            {datasets.map(dataset => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name} ({dataset.rowCount.toLocaleString()} rows)
              </option>
            ))}
          </select>
          <LayoutSelector />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KpiCard 
          title="Avg Position" 
          value={kpiData.avg_position} 
          loading={loading}
          change={5.2}
        />
        <KpiCard 
          title="CTR" 
          value={kpiData.ctr} 
          format="percentage" 
          loading={loading}
          change={-2.1}
        />
        <KpiCard 
          title="Impressions" 
          value={kpiData.impressions} 
          format="number"
          loading={loading}
          change={12.5}
        />
        <KpiCard 
          title="Clicks" 
          value={kpiData.clicks} 
          format="number"
          loading={loading}
          change={8.3}
        />
        <KpiCard 
          title="Conversions" 
          value={kpiData.conversions} 
          format="number"
          loading={loading}
          change={15.7}
        />
        <KpiCard 
          title="Conv. Rate" 
          value={kpiData.conversion_rate} 
          format="percentage"
          loading={loading}
          change={3.8}
        />
      </div>

      {/* Resizable Grid */}
      {currentLayout && (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: currentLayout.layout || defaultLayout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
          isDraggable
          isResizable
          draggableHandle=".drag-handle"
        >
          {(currentLayout.layout || defaultLayout).map((item) => (
            <div key={item.i}>
              <ChartPanel
                id={item.i}
                title={item.title}
                chartType={item.chartType}
                dataset={selectedDataset}
                onChartTypeChange={(type) => handleChartTypeChange(item.i, type)}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}

      {/* Data Table */}
      <div className="mt-6">
        <DataTable dataset={selectedDataset} />
      </div>
    </div>
  );
}