import React from "react";
import './card.css';

const rating = () => {
    return (
        <div className="rating-card">
            <div className="text-wrapper">
                <p className="text-primary">Please Rate The Book Here</p>
                <p className="text-secondary">to help us know your experience with it</p>
            </div>

            <div className="rating-stars-container">
                {[ 5, 4, 3, 2, 1].map((num) => (
                    <React.Fragment key={num}>
                        <input value={`star-${num}`} name="star" id={`star-${num}`} type="radio" />
                        <label htmlFor={`star-${num}`} className="star-label">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                                    pathLength="360"
                                ></path>
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default rating;
