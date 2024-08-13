import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import StarRating from './StarRating';
import './ReviewForm.css';

const ReviewForm = ({ movieId, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const { currentUser } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const review = {
            userId: currentUser.id,
            username: currentUser.username,
            movieId,
            rating,
            text: reviewText,
            date: new Date().toISOString()
        };

        onReviewSubmit(review);
        setRating(0);
        setReviewText('');
    };

    if (!currentUser) return null;

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Write a Review</h3>
            <StarRating rating={rating} onRatingChange={setRating} />
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                required
            />
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;