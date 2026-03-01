import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { FiSave, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LayoutSelector() {
  const { layouts, currentLayout, setCurrentLayout, saveLayout, deleteLayout } = useDashboard();
  const [newLayoutName, setNewLayoutName] = useState('');
  const [showNewLayout, setShowNewLayout] = useState(false);

  const handleSaveLayout = () => {
    if (!newLayoutName.trim()) {
      toast.error('Please enter a layout name');
      return;
    }

    saveLayout({
      name: newLayoutName,
      layout: currentLayout?.layout || []
    });

    setNewLayoutName('');
    setShowNewLayout(false);
  };

  const handleDeleteLayout = (id) => {
    if (confirm('Are you sure you want to delete this layout?')) {
      deleteLayout(id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentLayout?.id || ''}
        onChange={(e) => {
          const layout = layouts.find(l => l.id === e.target.value);
          setCurrentLayout(layout);
        }}
        className="border rounded-lg px-4 py-2"
      >
        <option value="">Select Layout</option>
        {layouts.map(layout => (
          <option key={layout.id} value={layout.id}>
            {layout.name}
          </option>
        ))}
      </select>

      {!showNewLayout ? (
        <button
          onClick={() => setShowNewLayout(true)}
          className="p-2 border rounded-lg hover:bg-gray-50"
          title="New Layout"
        >
          <FiPlus />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newLayoutName}
            onChange={(e) => setNewLayoutName(e.target.value)}
            placeholder="Layout name"
            className="border rounded-lg px-3 py-2 text-sm"
            autoFocus
          />
          <button
            onClick={handleSaveLayout}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            title="Save"
          >
            <FiSave />
          </button>
          <button
            onClick={() => setShowNewLayout(false)}
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Cancel"
          >
            ×
          </button>
        </div>
      )}

      {currentLayout && (
        <button
          onClick={() => handleDeleteLayout(currentLayout.id)}
          className="p-2 border rounded-lg hover:bg-red-50 text-red-600"
          title="Delete Layout"
        >
          <FiTrash2 />
        </button>
      )}
    </div>
  );
}