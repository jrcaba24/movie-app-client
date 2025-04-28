import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);  // State to handle redirect

    function registerUser(e) {
        e.preventDefault();
        fetch('https://movieapp-api-lms1.onrender.com/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered Successfully") {
                // Display success notification
                notyf.success('Registration successful! Please login.');

                // Clear input fields
                setEmail('');
                setPassword('');

                // Set the state to trigger the redirect to login page
                setRedirectToLogin(true);
            } else {
                // Display error notification
                notyf.error('Registration failed.');
            }
        })
    }

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    if (redirectToLogin) {
        // Redirect to login page after successful registration
        return <Navigate to="/login" />;
    }

    return (
        (user.id !== null) ?
            <Navigate to="/movies" />
            :
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Row className="w-100">
                    <Col md={6} className="mx-auto">
                        <Card className="p-4 shadow-lg">
                            <h2 className="text-center mb-4">Register</h2>
                            <Form onSubmit={registerUser}>
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
                                        Register
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
    );
}
