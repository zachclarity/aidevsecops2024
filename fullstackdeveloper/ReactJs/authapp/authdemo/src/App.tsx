
import React from 'react';
import { Container } from 'react-bootstrap';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NavBarLocal } from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SecurePage } from './pages/SecurePage';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <NavBarLocal/>
      <Container className="py-4">{children}</Container>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: '/secure',
    element: (
      <Layout>
        <ProtectedRoute>
          <SecurePage />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
