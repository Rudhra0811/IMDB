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
            <h1>Welcome, {currentUser.username}!</h1>
            <PersonalizedRecommendations />
            {/* Rest of the component remains the same */}
        </div>
    );
};

export default UserProfile;