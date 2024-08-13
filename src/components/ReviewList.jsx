import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews }) => {
    return (
        <div className="review-list">
            <h3>User Reviews</h3>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-header">
                            <span className="review-author">{review.username}</span>
                            <span className="review-rating">
                                {[...Array(5)].map((star, i) => (
                                    <span key={i} className={i < review.rating ? "star filled" : "star"}>
                                        &#9733;
                                    </span>
                                ))}
                            </span>
                            <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;