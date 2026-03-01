import UploadForm from '../components/forms/UploadForm';

export default function Upload() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Upload Dataset</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <UploadForm />
      </div>
    </div>
  );
}