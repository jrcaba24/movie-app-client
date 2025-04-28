import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function authenticate(e) {
        e.preventDefault();
        fetch('https://movieapp-api-lms1.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                notyf.success('Login successful!');
            } else {
                setErrorMessage('Invalid credentials. Please try again.');
                notyf.error('Login failed!');
            }
        })
        .catch(err => {
            setErrorMessage('Login failed. Please try again later.');
            notyf.error('Login failed!');
            console.error('Login error:', err);
        });
    }

    function retrieveUserDetails(token) {
        fetch('https://movieapp-api-lms1.onrender.com/users/details', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
        })
        .catch(err => {
            console.error('Error fetching user details:', err);
            setErrorMessage('Error fetching user details. Please try again later.');
        });
    }

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        (user.id !== null) ?
            <Navigate to="/movies" />
            :
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Row className="w-100">
                    <Col md={6} className="mx-auto">
                        <Card className="p-4 shadow-lg">
                            <h2 className="text-center mb-4">Login</h2>
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            <Form onSubmit={authenticate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Enter your password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={!isActive}>
                                        Login
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
    );
}
