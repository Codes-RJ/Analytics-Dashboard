import api from './api';

export const analyticsService = {
  async getDescriptiveStats(datasetId, columns = null) {
    const { data } = await api.post('/analytics/descriptive', { datasetId, columns });
    return data;
  },

  async getCorrelationMatrix(datasetId, method = 'pearson', columns = null) {
    const { data } = await api.post('/analytics/correlation', { datasetId, method, columns });
    return data;
  },

  async performRegression(datasetId, x, y) {
    const { data } = await api.post('/analytics/regression', { datasetId, x, y });
    return data;
  },

  async createPivotTable(datasetId, index, columns, values, aggfunc = 'mean') {
    const { data } = await api.post('/analytics/pivot', { datasetId, index, columns, values, aggfunc });
    return data;
  },

  async detectOutliers(datasetId, column, method = 'zscore', threshold = 3) {
    const { data } = await api.post('/analytics/outliers', { datasetId, column, method, threshold });
    return data;
  },

  async handleMissingValues(datasetId, strategy = 'drop', fillValue = null) {
    const { data } = await api.post('/analytics/missing', { datasetId, strategy, fillValue });
    return data;
  },

  async executeQuery(datasetId, query) {
    const { data } = await api.post('/analytics/query', { datasetId, query });
    return data;
  }
};