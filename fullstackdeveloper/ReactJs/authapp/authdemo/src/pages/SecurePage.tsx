
import { AuthContext, logout  } from '../context/AuthContext';
import React, { useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const SecurePage: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title>Secure Page</Card.Title>
            <Button variant="outline-primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <Card.Text>Welcome, {context?.username}!</Card.Text>
          <Card.Text className="text-muted">
            This is a protected page that can only be accessed by authenticated
            users.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};
