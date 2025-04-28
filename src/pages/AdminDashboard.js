import { useEffect, useState } from 'react';
import { Table, Button, Container, Spinner, Alert, Modal, Form } from 'react-bootstrap';

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Manage the update modal state
    const [showAddModal, setShowAddModal] = useState(false); // Manage the add modal state
    const [movieToUpdate, setMovieToUpdate] = useState(null); // Store the movie to be updated

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.movies && Array.isArray(data.movies)) {
                    setMovies(data.movies);
                } else {
                    setError('Unexpected data format');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching movies.');
                setLoading(false);
                console.error('Error fetching movies:', err);
            });
    }, []);

    const handleUpdate = (movie) => {
        setMovieToUpdate(movie); // Set the movie to update
        setShowUpdateModal(true); // Show the update modal
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const updatedMovie = {
            title: e.target.title.value,
            director: e.target.director.value,
            year: e.target.year.value,
            genre: e.target.genre.value,
        };

        fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${movieToUpdate._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedMovie),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Update the movie in the state
                    setMovies(
                        movies.map((movie) =>
                            movie._id === movieToUpdate._id ? { ...movie, ...updatedMovie } : movie
                        )
                    );
                    setShowUpdateModal(false); // Close the modal
                    setMovieToUpdate(null); // Clear the movie to update
                } else {
                    setError('Error updating movie');
                    console.error('Error updating movie:', data);
                }
            })
            .catch((err) => {
                setError('Error updating movie');
                console.error('Error updating movie:', err);
            });
    };

    const handleDelete = (movieId) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this movie?')) {
            fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movieId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setMovies(movies.filter((movie) => movie._id !== movieId)); // Remove the movie from the state
                    } else {
                        setError('Error deleting movie');
                        console.error('Error deleting movie:', data);
                    }
                })
                .catch((err) => {
                    setError('Error deleting movie');
                    console.error('Error deleting movie:', err);
                });
        }
    };

    const handleAddMovie = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const newMovie = {
            title: e.target.title.value,
            director: e.target.director.value,
            year: e.target.year.value,
            genre: e.target.genre.value,
        };

        fetch('https://movieapp-api-lms1.onrender.com/movies/addMovie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newMovie),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMovies([data.movie, ...movies]); // Prepend the new movie to the list
                    setShowAddModal(false); // Close the add movie modal
                } else {
                    setError('Error adding movie');
                    console.error('Error adding movie:', data);
                }
            })
            .catch((err) => {
                setError('Error adding movie');
                console.error('Error adding movie:', err);
            });
    };

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

    if (error) {
        return (
            <Container className="py-5">
                <h2 className="text-center mb-4">Admin Dashboard</h2>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={() => setShowAddModal(true)}>
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
                    {movies.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.director}</td>
                            <td>{movie.year}</td>
                            <td>{movie.genre}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleUpdate(movie)}
                                    className="me-2"
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(movie._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Movie Modal */}
            {movieToUpdate && (
                <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Movie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={movieToUpdate.title}
                                    placeholder="Enter movie title"
                                />
                            </Form.Group>

                            <Form.Group controlId="director" className="mb-3">
                                <Form.Label>Director</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={movieToUpdate.director}
                                    placeholder="Enter director name"
                                />
                            </Form.Group>

                            <Form.Group controlId="year" className="mb-3">
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={movieToUpdate.year}
                                    placeholder="Enter release year"
                                />
                            </Form.Group>

                            <Form.Group controlId="genre" className="mb-3">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={movieToUpdate.genre}
                                    placeholder="Enter genre"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}

            {/* Add Movie Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMovie}>
                        <Form.Group controlId="title" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter movie title"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="director" className="mb-3">
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter director name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="year" className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter release year"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="genre" className="mb-3">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Add Movie
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
