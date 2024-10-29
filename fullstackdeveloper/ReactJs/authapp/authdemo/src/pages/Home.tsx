
import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body className="text-center">
          <Card.Title className="mb-4">Welcome to the App</Card.Title>
          <div className="d-grid gap-2">
            <Link to="/login" className="text-decoration-none">
              <Button variant="primary" className="w-100">
                Go to Login
              </Button>
            </Link>
            <Link to="/secure" className="text-decoration-none">
              <Button variant="outline-primary" className="w-100">
                Go to Secure Page
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
