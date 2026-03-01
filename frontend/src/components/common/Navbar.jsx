import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUpload, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600">Analytics Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  <FiHome className="inline mr-1" /> Dashboard
                </Link>
                <Link to="/upload" className="nav-link">
                  <FiUpload className="inline mr-1" /> Upload
                </Link>
                <Link to="/profile" className="nav-link">
                  <FiUser className="inline mr-1" /> Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="nav-link">
                    <FiSettings className="inline mr-1" /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="nav-link text-red-600 hover:text-red-800"
                >
                  <FiLogOut className="inline mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}