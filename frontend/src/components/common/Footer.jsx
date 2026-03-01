import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Analytics Dashboard. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}