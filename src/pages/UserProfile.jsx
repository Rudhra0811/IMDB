import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import './UserProfile.css';

const UserProfile = () => {
    const { currentUser } = useAuth();

    if (currentUser === null) {
        // User is not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (!currentUser) {
        // User state is still loading, show a loading indicator
        return <div>Loading...</div>;
    }

    const watchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.id}`) || '[]');
    const reviews = Object.values(JSON.parse(localStorage.getItem('reviews') || '{}'))
        .filter(review => review.userId === currentUser.id);

    return (
        <div className="user-profile">
            <div className="user-profile">
                <h1>Welcome, {currentUser.username}!</h1>
                <PersonalizedRecommendations />
                <div className="profile-section">
                    <h2>Your Watchlist</h2>
                    {watchlist.length > 0 ? (
                        <ul className="watchlist-preview">
                            {watchlist.slice(0, 5).map(movie => (
                                <li key={movie.id}>{movie.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Your watchlist is empty.</p>
                    )}
                </div>
                <div className="profile-section">
                    <h2>Your Reviews</h2>
                    {reviews.length > 0 ? (
                        <ul className="reviews-preview">
                            {reviews.slice(0, 5).map((review, index) => (
                                <li key={index}>
                                    <strong>{review.movieTitle}</strong>: {review.rating}/5 - {review.text.slice(0, 50)}...
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You haven't written any reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;