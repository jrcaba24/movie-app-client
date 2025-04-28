import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Movies() {
    const [movies, setMovies] = useState([]); // Initialize as an empty array

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Log the response to check the structure
            if (data.movies && Array.isArray(data.movies)) {
                setMovies(data.movies); // Set movies array if it's correctly nested in 'movies'
            } else {
                console.error("Expected 'movies' array but got:", data);
            }
        })
        .catch(err => {
            console.error('Error fetching movies:', err);
        });
    }, []);

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5">Movie Catalog</h2>
            <Row>
                {movies.length > 0 ? (
                    movies.map(movie => (
                        <Col key={movie._id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{movie.genre} | {movie.year}</Card.Subtitle>
                                    <Card.Text><strong>Director:</strong> {movie.director}</Card.Text>
                                    <Card.Text><strong>Description:</strong> {movie.description}</Card.Text>
                                    <Button as={Link} to={`/movies/${movie._id}`} variant="primary" className="mt-3">
                                        View Movie
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No movies available at the moment.</p>
                )}
            </Row>
        </Container>
    );
}
