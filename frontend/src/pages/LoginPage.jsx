import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register({ email, password });
        setSuccess('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        const { data } = await login({ email, password });
        loginUser(data.token, data.admin);
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegistering ? 'Registration failed.' : 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0 my-5">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="h4 text-gray-900 mb-4 font-weight-bold" style={{ color: '#4e73df' }}>
                    {isRegistering ? 'Create an Account' : 'Welcome'}
                  </h2>
                  <p className="text-muted small">
                    {isRegistering ? 'Register a new admin account' : 'Login to access the dashboard'}
                  </p>
                </div>

                {error && <Alert variant="danger" className="small">{error}</Alert>}
                {success && <Alert variant="success" className="small">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                      type="email" 
                      placeholder="Enter Email Address..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control-user py-2"
                      style={{ borderRadius: '10rem' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Control 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control-user py-2"
                      style={{ borderRadius: '10rem' }}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 font-weight-bold" 
                    disabled={loading}
                    style={{ borderRadius: '10rem', backgroundColor: '#4e73df', borderColor: '#4e73df' }}
                  >
                    {loading ? 'Processing...' : (isRegistering ? 'Register Account' : 'Login')}
                  </Button>

                  <hr className="my-4" />

                  <div className="text-center">
                    <Button variant="link" className="small" onClick={() => {
                      setIsRegistering(!isRegistering);
                      setError('');
                      setSuccess('');
                    }}>
                      {isRegistering ? 'Already have an account? Login!' : 'Create an Account!'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
