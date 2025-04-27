import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import './detailpage.css';

const DetailPage = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME); 

  const [book, setBook] = useState(null); // Store book data
  const [reviews, setReviews] = useState([]); // Store reviews
  const [comment, setComment] = useState(""); // Store comment input
  const [rating, setRating] = useState(3); // Store rating
  const [error, setError] = useState(""); // Store error messages
  const [saved, setSaved] = useState(false); // Store save status
  const [loading, setLoading] = useState(true); // Handle loading state

  // Fetch book data and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch book data from Google Books API
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        console.log("Book data:", response.data); // Log book data for debugging
        setBook(response.data); // Set the book data

        // Fetch reviews from backend (ensure backend route is correct)
        try {
          const reviewsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/reviews/${id}`);
          setReviews(reviewsResponse.data); // Set the reviews
        } catch (reviewErr) {
          console.log("No reviews yet or error fetching reviews");
          setReviews([]); // Set empty reviews if no reviews found
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Log the error
        setError("Failed to load book details");
      } finally {
        setLoading(false); // Set loading state to false after data is fetched
      }
    };

    fetchData(); // Trigger the fetch data function
  }, [id]); // Re-fetch if the book ID changes

  // Handle saving book to user's collection
  const handleSave = async () => {
    try {
      // Get book info
      const { title, authors, description, infoLink } = book.volumeInfo;
      const image = book.volumeInfo?.imageLinks?.thumbnail || "https://i.pinimg.com/474x/f1/31/c5/f131c545376e2d6ce9563e7e4bb8d63d.jpg";
      const bookId = book.id; // Set bookId from the Google Books ID

      // Log the data that will be sent to backend for debugging
      console.log({
        title,
        authors,
        description,
        infoLink,
        image,
        bookId,
      });

      // Send full book info to backend with token
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/save`,
        { title, authors, description, infoLink, image, bookId }, // First object (data)
        { headers: { Authorization: `Bearer ${token}` } } // Second object (config)
      );

      setSaved(true); // Update saved state to true
    } catch (err) {
      setError("Could not save book."); // Handle save error
    }
  };

  // Handle review submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } } // Add token to request headers
      );
      setComment(""); // Reset comment field
      setRating(3); // Reset rating
      setError(""); // Reset error
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/reviews/${id}`); // Re-fetch reviews
      setReviews(data);
    } catch (err) {
      setError("Could not submit review."); // Handle review submission error
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container className="mt-5">
        <Row>
          <Col className="text-center">
            <h2>Loading book details...</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container className="mt-5">
        <Row>
          <Col className="text-center">
            <h2>Error: {error}</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show no book found state
  if (!book) {
    return (
      <Container className="mt-5">
        <Row>
          <Col className="text-center">
            <h2>Book not found</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  const { volumeInfo } = book; // Destructure volume info
  const image = volumeInfo?.imageLinks?.thumbnail || "https://i.pinimg.com/474x/fc/7e/ce/fc7ece8e8ee1f5db97577a4622f33975.jpg"; // Default image if not found

  return (
    <Container className="detail-container mt-5">
      <Row>
        <Col md={4}>
          <img src={image} alt={volumeInfo.title} className="img-fluid rounded" />
        </Col>
        <Col md={8}>
          <h1>{volumeInfo.title}</h1>
          <p><strong>Author:</strong> {volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author"}</p>
          <p><strong>Description:</strong> {volumeInfo.description || "No description available."}</p>
          <p><strong>Average Rating:</strong> {volumeInfo.averageRating ? `${volumeInfo.averageRating} ★` : "No rating yet"}</p>

          <div className="mt-4">
            <h5>Save This Book:</h5>
            <button className="btn btn-outline-dark" onClick={handleSave} disabled={saved}>
              {saved ? "Saved" : "Save"}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2>Reviews</h2>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          <ListGroup variant="flush">
            {reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.user?.name || "Anonymous"}</strong>
                <p>{'★'.repeat(review.rating)}</p>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              {error && <p className="text-danger">{error}</p>}
              <form className="form" onSubmit={submitHandler}>
                <div>
                  <h2>Write a customer review</h2>
                  <label>Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="form-control mb-2"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r} star{r > 1 && "s"}</option>
                    ))}
                  </select>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                  />
                  <button className="btn btn-primary mt-3" type="submit">Submit</button>
                </div>
              </form>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailPage;
