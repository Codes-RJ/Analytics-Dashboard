import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/sql': ['.sql'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      if (!name) {
        setName(acceptedFiles[0].name.split('.')[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      toast.error(rejectedFiles[0].errors[0].message);
    }
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name || file.name);
    formData.append('description', description);

    setUploading(true);
    try {
      await api.post('/datasets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Dataset uploaded successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {file ? (
          <div>
            <p className="text-lg font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your file here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports CSV, XLSX, XLS, SQL (max 100MB)
            </p>
          </div>
        )}
      </div>

      {/* Dataset Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Dataset Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Enter dataset name"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input"
          placeholder="Enter dataset description"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Dataset'}
      </button>
    </div>
  );
}