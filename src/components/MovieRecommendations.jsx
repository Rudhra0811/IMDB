import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MovieRecommendations.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const MovieRecommendations = ({ movieId }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`
                );
                setRecommendations(response.data.results.slice(0, 6));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [movieId]);

    if (recommendations.length === 0) return null;

    return (
        <div className="movie-recommendations">
            <h3>You might also like</h3>
            <div className="recommendations-grid">
                {recommendations.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="recommendation-item">
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

export default MovieRecommendations;