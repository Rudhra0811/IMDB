import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SimilarMovies.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const SimilarMovies = ({ movieId }) => {
    const [similarMovies, setSimilarMovies] = useState([]);

    useEffect(() => {
        const fetchSimilarMovies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/movie/${movieId}/similar`, {
                    params: {
                        api_key: API_KEY,
                        language: 'en-US',
                        page: 1
                    }
                });
                setSimilarMovies(response.data.results.slice(0, 6)); // Limit to 6 similar movies
            } catch (error) {
                console.error('Error fetching similar movies:', error);
            }
        };

        fetchSimilarMovies();
    }, [movieId]);

    if (similarMovies.length === 0) return null;

    return (
        <div className="similar-movies">
            <h3>Similar Movies</h3>
            <div className="similar-movies-grid">
                {similarMovies.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="similar-movie-item">
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <p>{movie.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimilarMovies;