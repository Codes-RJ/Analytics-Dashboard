import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiUpload, FiGrid, FiShield } from 'react-icons/fi';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FiBarChart2 className="h-8 w-8 text-primary-600" />,
      title: 'Advanced Analytics',
      description: 'Descriptive statistics, correlation matrices, regression analysis, and more.'
    },
    {
      icon: <FiUpload className="h-8 w-8 text-primary-600" />,
      title: 'Multiple Data Sources',
      description: 'Upload CSV, XLSX, SQL files or connect directly to your database.'
    },
    {
      icon: <FiGrid className="h-8 w-8 text-primary-600" />,
      title: 'Customizable Dashboard',
      description: 'Drag-and-drop panels, resizable charts, save your favorite layouts.'
    },
    {
      icon: <FiShield className="h-8 w-8 text-primary-600" />,
      title: 'Enterprise Security',
      description: 'JWT authentication, role-based access, and secure data handling.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Data Analytics</span>
                  <span className="block text-primary-600">Made Simple</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Upload your data, create beautiful visualizations, and gain insights with our powerful analytics dashboard. Support for datasets up to 50k+ rows.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to={isAuthenticated ? "/dashboard" : "/register"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for data analysis
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Powerful tools to help you understand your data and make better decisions.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}