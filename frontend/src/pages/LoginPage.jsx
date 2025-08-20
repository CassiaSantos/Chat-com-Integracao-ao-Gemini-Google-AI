import React, { useState } from 'react';
import { loginUser } from '../lib/api';

// componentes do React-Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const userData = await loginUser(username);
      onLogin(userData);
    } catch (err) {
      setError('Falha ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <div className="login-box">
            <h4 className="h4 mb-3 text-center">Bem-vinde ao</h4>
            <h1 className="h1 mb-3 text-center">Cass-IA&#x2728;</h1>
            <h3 className="h3 mb-3 text-center">Seu chat assistente com Gemini</h3>
            <p className="text-muted text-center mb-4">
              Digite seu nome de usuário para continuar.
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                  disabled={isLoading}
                  autoFocus
                  size="lg"
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isLoading} className="w-100" size="lg">
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Entrando...</span>
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}