import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

export default function MovieDetails() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovie/${movieId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setMovie(data))
        .catch(err => console.error('Error fetching movie details:', err));
    }, [movieId]);

    if (!movie) return <p>Loading...</p>;

    return (
        <Container className="py-5">
            <Card className="p-4 shadow-lg">
                <h2 className="text-center mb-4">{movie.title}</h2>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Year:</strong> {movie.year}</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Description:</strong> {movie.description}</p>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    Back
                </Button>
            </Card>
        </Container>
    );
}
