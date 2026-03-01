export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateFileType = (filename, allowedTypes) => {
    const ext = filename.split('.').pop().toLowerCase();
    return allowedTypes.includes(`.${ext}`);
  };
  
  export const validateFileSize = (size, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  };
  
  export const validateDatasetName = (name) => {
    return name && name.length >= 1 && name.length <= 100;
};