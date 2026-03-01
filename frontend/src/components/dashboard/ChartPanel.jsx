import { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ChartPanel({ id, title, chartType, dataset, onChartTypeChange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const panelRef = useRef();

  useEffect(() => {
    if (dataset) {
      fetchChartData();
      fetchColumns();
    }
  }, [dataset]);

  useEffect(() => {
    if (columns.length > 0) {
      setSelectedX(columns[0]);
      setSelectedY(columns[1] || columns[0]);
    }
  }, [columns]);

  const fetchChartData = async () => {
    if (!dataset) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/datasets/${dataset.id}/data?limit=100`);
      setData(data.data);
    } catch (error) {
      console.error('Failed to fetch chart data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColumns = async () => {
    if (!dataset) return;
    try {
      const { data } = await api.get(`/datasets/${dataset.id}`);
      setColumns(data.columns.map(col => col.name));
    } catch (error) {
      console.error('Failed to fetch columns', error);
    }
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!dataset) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a dataset to view chart
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      );
    }

    const chartProps = {
      width: '100%',
      height: '100%',
      data: data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer>
            <LineChart {...chartProps}>
              <XAxis dataKey={selectedX} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={selectedY} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer>
            <BarChart {...chartProps}>
              <XAxis dataKey={selectedX} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedY} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.slice(0, 10)}
                dataKey={selectedY}
                nameKey={selectedX}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer>
            <AreaChart {...chartProps}>
              <XAxis dataKey={selectedX} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={selectedY} fill="#8884d8" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer>
            <ScatterChart {...chartProps}>
              <XAxis dataKey={selectedX} />
              <YAxis dataKey={selectedY} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Scatter data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div ref={panelRef} className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b drag-handle cursor-move">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <div className="flex gap-2">
          <select
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="area">Area</option>
            <option value="scatter">Scatter</option>
          </select>
          {dataset && (
            <>
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {columns.map(col => (
                  <option key={col} value={col}>X: {col}</option>
                ))}
              </select>
              <select
                value={selectedY}
                onChange={(e) => setSelectedY(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {columns.map(col => (
                  <option key={col} value={col}>Y: {col}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 p-4" style={{ minHeight: 0 }}>
        {renderChart()}
      </div>
    </div>
  );
}