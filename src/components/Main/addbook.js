import { useState } from "react";
import "./addbook.css"; 



function AddBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!book.title || !book.author || !book.description) {
      setError("All fields except image URL are required.");
      return;
    }

    // Get token from localStorage using name from .env
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME);

    // Send the data to the backend
    try {
      const response = await fetch("http://localhost:8080/api/book/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      alert("Book added successfully");
      setBook({
        title: "",
        author: "",
        description: "",
        imageUrl: "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-box">
        <h1>Add a Book</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="text"
              name="imageUrl"
              value={book.imageUrl}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
