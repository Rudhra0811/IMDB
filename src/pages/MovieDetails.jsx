import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [streamingProviders, setStreamingProviders] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const [movieResponse, providersResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`),
                    axios.get(`${API_BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`)
                ]);
                setMovie(movieResponse.data);
                setStreamingProviders(providersResponse.data.results.US?.flatrate || []);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-details">
            <div className="movie-header">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                />
                <div className="movie-info">
                    <h1>{movie.title}</h1>
                    <p className="movie-tagline">{movie.tagline}</p>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                    <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
                    <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                </div>
            </div>
            <h2>Overview</h2>
            <p>{movie.overview}</p>
            <h2>Cast</h2>
            <div className="cast-list">
                {movie.credits.cast.slice(0, 5).map(actor => (
                    <div key={actor.id} className="cast-item">
                        <img
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name}
                            className="cast-photo"
                        />
                        <p>{actor.name}</p>
                        <p className="character-name">as {actor.character}</p>
                    </div>
                ))}
            </div>
            <h2>Available for Streaming</h2>
            {streamingProviders.length > 0 ? (
                <ul className="streaming-providers">
                    {streamingProviders.map(provider => (
                        <li key={provider.provider_id}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="provider-logo"
                            />
                            {provider.provider_name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No streaming information available.</p>
            )}
        </div>
    );
}

export default MovieDetails;