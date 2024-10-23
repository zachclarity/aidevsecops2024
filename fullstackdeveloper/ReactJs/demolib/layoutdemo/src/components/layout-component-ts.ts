import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutProps, NavigationItem } from '@/types';

const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: '/', label: 'Home' },
  { path: '/feature1', label: 'Feature 1' },
  { path: '/feature2', label: 'Feature 2' },
  { path: '/feature3', label: 'Feature 3' },
];

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();

  const isActiveLink = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">My Website</h1>
        <nav className="mt-2">
          <ul className="flex space-x-4">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`hover:text-blue-200 ${
                    isActiveLink(item.path) ? 'text-blue-200' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
