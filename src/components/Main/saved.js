import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card'; // Import the Card component
import './saved.css';

const SavedBooks = () => {
  // Get the token from localStorage using the environment variable name
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME);
  const [savedBooks, setSavedBooks] = useState([]); // Store saved books data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(''); // Handle error messages

  // Fetch saved books data
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true); // Set loading to true when fetching data

        // Fetch saved books from backend API
        const savedRes = await axios.get("http://localhost:8080/api/save", {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
        });

        // Fetch details of each saved book from Google Books API
        const bookDetailsPromises = savedRes.data.map(async (item) => {
          const bookRes = await axios.get(`https://www.googleapis.com/books/v1/volumes/${item.bookId}`);
          const info = bookRes.data.volumeInfo;
          return {
            id: item.bookId, // Book ID
            title: info.title, // Book title
            authors: info.authors, // Book authors
            image: info.imageLinks?.thumbnail || '', // Book image or placeholder
            rating: info.averageRating || 0, // Book rating
            category: info.categories ? info.categories[0] : "Unknown" // Book category
          };
        });

        // Wait for all book details to be fetched
        const bookDetails = await Promise.all(bookDetailsPromises);
        setSavedBooks(bookDetails); // Set saved books data
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error('Error fetching saved books:', err); // Log error to console
        setError('Failed to fetch saved books.'); // Set error message
        setLoading(false); // Set loading to false even if there was an error
      }
    };

    fetchSaved(); // Trigger the fetch saved books function
  }, [token]); // Re-fetch when token changes

  if (loading) return <p>Loading...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message
  if (savedBooks.length === 0) return <p>No saved books yet.</p>; // Show message if no saved books

  return (
    <div className="main-container">
      <h1 className="page-title">Saved Books</h1>
      <div className="card-grid">
        {/* Render saved books as Card components */}
        {savedBooks.map((book) => (
          <Card
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.authors}
            image={book.image}
            rating={book.rating}
            category={book.category}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedBooks;
