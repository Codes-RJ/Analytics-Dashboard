export const formatNumber = (num) => {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  export const formatPercentage = (num) => {
    if (num === null || num === undefined) return '—';
    return `${Number(num).toFixed(2)}%`;
  };
  
  export const formatCurrency = (num) => {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };
  
  export const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};