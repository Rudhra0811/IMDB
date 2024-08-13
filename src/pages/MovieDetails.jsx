import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import MovieRecommendations from '../components/MovieRecommendations';
import './MovieDetails.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [streamingProviders, setStreamingProviders] = useState([]);
    const { currentUser } = useAuth();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [reviews, setReviews] = useState([]);

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

        if (currentUser) {
            const storedWatchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.id}`) || '[]');
            setIsInWatchlist(storedWatchlist.some(item => item.id === parseInt(id)));
        }

        const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]');
        setReviews(storedReviews);

        fetchMovieDetails();
    }, [id, currentUser]);

    const handleReviewSubmit = (newReview) => {
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    };

    const toggleWatchlist = () => {
        if (!currentUser) return;

        const storedWatchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.id}`) || '[]');
        let updatedWatchlist;

        if (isInWatchlist) {
            updatedWatchlist = storedWatchlist.filter(item => item.id !== movie.id);
        } else {
            updatedWatchlist = [...storedWatchlist, { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date }];
        }

        localStorage.setItem(`watchlist_${currentUser.id}`, JSON.stringify(updatedWatchlist));
        setIsInWatchlist(!isInWatchlist);
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-details-container">
            <div className="movie-details-content">
                <div className="movie-poster-container">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                    />
                </div>
                <div className="movie-info-container">
                    <h1 className="movie-title">{movie.title}</h1>
                    <p className="movie-tagline">{movie.tagline}</p>
                    <div className="movie-meta">
                        <span className="movie-year">{new Date(movie.release_date).getFullYear()}</span>
                        <span className="movie-runtime">{movie.runtime} min</span>
                        <span className="movie-rating">{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                    <p className="movie-genres">{movie.genres.map(genre => genre.name).join(', ')}</p>
                    <h3>Overview</h3>
                    <p className="movie-overview">{movie.overview}</p>
                    <h3>Cast</h3>
                    <div className="cast-list">
                        {movie.credits.cast.slice(0, 5).map(actor => (
                            <div key={actor.id} className="cast-item">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    alt={actor.name}
                                    className="cast-photo"
                                />
                                <p className="actor-name">{actor.name}</p>
                                <p className="character-name">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Streaming</h3>
                    {streamingProviders.length > 0 ? (
                        <ul className="streaming-providers">
                            {streamingProviders.map(provider => (
                                <li key={provider.provider_id}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                        alt={provider.provider_name}
                                        className="provider-logo"
                                    />
                                    <span>{provider.provider_name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No streaming information available.</p>
                    )}
                    {currentUser && (
                        <button onClick={toggleWatchlist} className="watchlist-btn">
                            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    )}
                </div>
            </div>
            <ReviewForm movieId={id} onReviewSubmit={handleReviewSubmit} />
            <ReviewList reviews={reviews} />
            <MovieRecommendations movieId={id} />
        </div>
    );
}

export default MovieDetails;