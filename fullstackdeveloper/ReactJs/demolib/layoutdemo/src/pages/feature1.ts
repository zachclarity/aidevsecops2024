import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FeatureProps, NavigationItem } from '@/types';

const COLUMN_ITEMS: NavigationItem[] = [
  { path: 'column1', label: 'Column 1' },
  { path: 'column2', label: 'Column 2' },
  { path: 'column3', label: 'Column 3' },
];

const Feature1: React.FC<FeatureProps> = ({ title = 'Feature 1' }) => {
  const location = useLocation();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <div className="mb-8">
          <nav className="flex space-x-4 border-b">
            {COLUMN_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 ${
                  location.pathname.includes(item.path)
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Feature1;
