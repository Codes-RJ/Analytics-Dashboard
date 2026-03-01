import { useState, useEffect } from 'react';
import { FiX, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ChartConfigModal({ isOpen, onClose, chart, onSave }) {
  const [config, setConfig] = useState({
    title: '',
    chartType: 'line',
    xAxis: '',
    yAxis: '',
    color: '#3b82f6',
    showLegend: true,
    showGrid: true,
    animate: true
  });

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (chart) {
      setConfig({
        title: chart.title || '',
        chartType: chart.chartType || 'line',
        xAxis: chart.xAxis || '',
        yAxis: chart.yAxis || '',
        color: chart.color || '#3b82f6',
        showLegend: chart.showLegend !== false,
        showGrid: chart.showGrid !== false,
        animate: chart.animate !== false
      });
    }
  }, [chart]);

  useEffect(() => {
    // Fetch columns from selected dataset if available
    if (chart?.dataset) {
      setColumns(chart.dataset.columns?.map(col => col.name) || []);
    }
  }, [chart]);

  const handleSave = () => {
    if (!config.title) {
      toast.error('Please enter a chart title');
      return;
    }
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 py-4 bg-primary-600 flex justify-between items-center">
            <div className="flex items-center text-white">
              <FiSettings className="mr-2" />
              <h3 className="text-lg font-medium">Configure Chart</h3>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FiX size={20} />
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Chart Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="input"
                  placeholder="Enter chart title"
                />
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  value={config.chartType}
                  onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
                  className="input"
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </select>
              </div>

              {/* X Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Axis
                </label>
                <select
                  value={config.xAxis}
                  onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
                  className="input"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Y Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Axis
                </label>
                <select
                  value={config.yAxis}
                  onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
                  className="input"
                >
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Color
                </label>
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  className="w-full h-10 p-1 border rounded"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showLegend}
                    onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Legend</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showGrid}
                    onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Grid</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.animate}
                    onChange={(e) => setConfig({ ...config, animate: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Animations</span>
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}