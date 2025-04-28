import { useEffect, useState } from 'react';
import { Table, Button, Container, Spinner, Alert, Modal } from 'react-bootstrap';

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState('');       // Error state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state for delete
    const [movieToDelete, setMovieToDelete] = useState(null);  // Movie to delete

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.movies && Array.isArray(data.movies)) {
                setMovies(data.movies);
            } else {
                setError("Unexpected data format");
            }
            setLoading(false);
        })
        .catch(err => {
            setError('Error fetching movies.');
            setLoading(false);
            console.error('Error fetching movies:', err);
        });
    }, []);

    // Handle movie update
    const handleUpdate = (movieId) => {
        // Navigate to the update page or open a modal for editing
        console.log(`Update movie with ID: ${movieId}`);
        // Example: You can use react-router to navigate to a detailed update page.
    };

    // Handle movie delete
    const handleDelete = (movieId) => {
        const token = localStorage.getItem('token');
        fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movieId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMovies(movies.filter(movie => movie._id !== movieId)); // Remove the deleted movie from the state
                setShowDeleteModal(false); // Close the modal
                setMovieToDelete(null); // Clear the movie to delete
            } else {
                setError('Error deleting movie');
                console.error('Error deleting movie:', data);
            }
        })
        .catch(err => {
            setError('Error deleting movie');
            console.error('Error deleting movie:', err);
        });
    };

    // Show loading spinner when movies are being fetched
    if (loading) {
        return (
            <Container className="py-5">
                <h2 className="text-center mb-4">Admin Dashboard</h2>
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </Container>
        );
    }

    // Show error message if there is an error fetching movies
    if (error) {
        return (
            <Container className="py-5">
                <h2 className="text-center mb-4">Admin Dashboard</h2>
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <div className="d-flex justify-content-end mb-3">
                <Button id="addMovie" variant="success">
                    Add Movie
                </Button>
            </div>
            <Table bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                        <th>Genre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.director}</td>
                            <td>{movie.year}</td>
                            <td>{movie.genre}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleUpdate(movie._id)} className="me-2">
                                    Update
                                </Button>
                                <Button variant="danger" onClick={() => { setMovieToDelete(movie._id); setShowDeleteModal(true); }}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this movie? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(movieToDelete)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
