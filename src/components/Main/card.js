import React from 'react';
import Col from 'react-bootstrap/Col';
import './card.css';
import { useNavigate } from 'react-router-dom';

const Card = ({ book }) => {
    const genres = book?.volumeInfo?.categories?.join(', ') || "No genres available";
    const navigate = useNavigate();

    const handleExploreMore = () => {
        navigate(`/details/${book?.id}`);
    };

    return (
        <Col md="4" className="d-flex justify-content-center mb-4">
            <div className="card">
                <div className="front-page" style={{ backgroundImage: `url(${book?.volumeInfo?.imageLinks?.thumbnail})` }}>
                    <div className="card-info">
                        <div className="card-rating">
                        </div>
                    </div>
                </div>
                <div className="back-page">
                    <div className="card-content">
                        <span>{book?.volumeInfo?.averageRating || 'N/A'} ★</span>
                        <span>{genres}</span>
                        <h3>{book?.volumeInfo?.title}</h3>
                        <p className="card-description">{book?.volumeInfo?.description}</p>
                        <button className="card-button" onClick={handleExploreMore}>Explore More</button>
                    </div>
                </div>
            </div>
        </Col>
    );
};

export default Card;
