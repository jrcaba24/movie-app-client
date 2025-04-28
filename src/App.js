import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import AdminDashboard from './pages/AdminDashboard';
import MovieDetails from './pages/MovieDetails';
import { UserProvider } from './UserContext';
import { Notyf } from 'notyf';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const notyf = new Notyf();

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
        setErrorMessage('Session expired. Please log in again.');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://movieapp-api-lms1.onrender.com/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUser({
                            id: data.user._id,
                            isAdmin: data.user.isAdmin
                        });
                    } else {
                        unsetUser();
                    }
                })
                .catch(err => {
                    unsetUser();
                    setErrorMessage('Error fetching user details.');
                    console.error('Error fetching user details:', err);
                });
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies" element={user && user.isAdmin ? <AdminDashboard /> : <Movies />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/movies/:movieId" element={<MovieDetails />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
