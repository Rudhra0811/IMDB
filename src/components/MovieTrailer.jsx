import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieTrailer.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const MovieTrailer = ({ movieId }) => {
    const [trailerKey, setTrailerKey] = useState(null);

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/movie/${movieId}/videos`, {
                    params: { api_key: API_KEY }
                });
                const trailer = response.data.results.find(video => video.type === "Trailer");
                if (trailer) {
                    setTrailerKey(trailer.key);
                }
            } catch (error) {
                console.error('Error fetching trailer:', error);
            }
        };

        fetchTrailer();
    }, [movieId]);

    if (!trailerKey) return null;

    return (
        <div className="movie-trailer">
            <h3>Trailer</h3>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="movie trailer"
            ></iframe>
        </div>
    );
};

export default MovieTrailer;