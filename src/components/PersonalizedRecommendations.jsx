import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './PersonalizedRecommendations.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const PersonalizedRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!currentUser) return;

            const watchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.id}`) || '[]');
            const reviewedMovies = Object.keys(JSON.parse(localStorage.getItem('reviews') || '{}')).map(Number);

            const movieIds = [...new Set([...watchlist.map(m => m.id), ...reviewedMovies])];

            try {
                const recommendationPromises = movieIds.slice(0, 3).map(id =>
                    axios.get(`${API_BASE_URL}/movie/${id}/recommendations`, {
                        params: { api_key: API_KEY }
                    })
                );

                const responses = await Promise.all(recommendationPromises);
                const allRecommendations = responses.flatMap(response => response.data.results);
                const uniqueRecommendations = Array.from(new Set(allRecommendations.map(m => m.id)))
                    .map(id => allRecommendations.find(m => m.id === id))
                    .slice(0, 10);

                setRecommendations(uniqueRecommendations);
            } catch (error) {
                console.error('Error fetching personalized recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [currentUser]);

    if (!currentUser || recommendations.length === 0) return null;

    return (
        <div className="personalized-recommendations">
            <h2>Recommended for You</h2>
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

export default PersonalizedRecommendations;