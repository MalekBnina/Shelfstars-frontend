import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Card from './card'; // Import the Card component
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import styles from "./styles.module.css";
import { jwtDecode } from 'jwt-decode';
import DetailPage from './detailpage'; // Import the DetailPage component
import SavedBooks from './saved'; // Import the SavedBooks component
import AddBook from './addbook'; // Import the AddBook component

let API_key = "AIzaSyDIWquDLbrs-X8lfpx_uC7FDQJeoDliExw";
let base_url = "https://www.googleapis.com/books/v1/volumes";
let url = `${base_url}?q=subject:all&key=${API_key}`;

const Main = () => {
    const [bookData, setData] = useState([]);
    const [url_set, setUrl] = useState(url);
    const [search, setSearch] = useState("");
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    
    // Create refs for tracking dropdown elements
    const profileRef = useRef(null);
    const genreRef = useRef(null);
    const ratingRef = useRef(null);

    const genres = [
        'Arts & Photography', 'Biographies & Memoirs', 'Business & Money', 'Children\'s Books',
        'Comics & Graphic Novels', 'Computers & Technology', 'Cookbooks, Food & Wine', 'Education',
        'Health, Fitness & Dieting', 'History', 'Literature & Fiction', 'Mystery & Thriller', 'Nonfiction',
        'Parenting & Relationships', 'Politics & Social Sciences', 'Reference', 'Religion & Spirituality',
        'Science & Math', 'Science Fiction & Fantasy', 'Self-Help', 'Sports & Outdoors', 'Teen & Young Adult', 'Travel'
    ];

    const ratings = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];

    useEffect(() => {
        const token = localStorage.getItem('myTokenNameInLocalStorage');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin);
            console.log("isAdmin:", decodedToken.isAdmin);
        }

        fetch(url_set)
            .then(res => res.json())
            .then(data => {
                setData(data.items || []);
            });
    }, [url_set]);

    const getDataByGenre = (genre) => {
        const updatedUrl = `${base_url}?q=subject:${genre}&key=${API_key}`;
        setUrl(updatedUrl);
        setIsGenreOpen(false);
    };

    const getDataByRating = (rating) => {
        const ratingValue = rating.split(" ")[0];
        const filteredBooks = bookData.filter(book => {
            const bookRating = book.volumeInfo.averageRating;
            return bookRating >= ratingValue && bookRating < (Number(ratingValue) + 1);
        });
        setData(filteredBooks);
        setIsRatingOpen(false);
    };

    const searchBook = (evt) => {
        if (evt.key === "Enter") {
            const updatedUrl = `${base_url}?q=${search}&key=${API_key}`;
            setUrl(updatedUrl);
            setSearch("");
        }
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem('myTokenNameInLocalStorage');
        setIsProfileOpen(false);
        navigate('/');
        console.log("Redirected to home");
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenreOpen(false);
            }
            if (ratingRef.current && !ratingRef.current.contains(event.target)) {
                setIsRatingOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.navLeft}>
                    <Link to="/" className={styles.navLink}>Home Page</Link>
                </div>
                <div className={styles.navCenter}>
                    <div className={styles.genreDropdown} ref={genreRef}>
                        <button className={styles.navLink} onClick={() => setIsGenreOpen(!isGenreOpen)}>Genres</button>
                        {isGenreOpen && (
                            <div className={styles.dropdownMenu}>
                                {genres.map((genre, index) => (
                                    <div key={index} className={styles.dropdownItem} onClick={() => getDataByGenre(genre)}>{genre}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.ratingDropdown} ref={ratingRef}>
                        <button className={styles.navLink} onClick={() => setIsRatingOpen(!isRatingOpen)}>Rating</button>
                        {isRatingOpen && (
                            <div className={styles.dropdownMenu}>
                                {ratings.map((rating, index) => (
                                    <div key={index} className={styles.dropdownItem} onClick={() => getDataByRating(rating)}>{rating}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.navRight}>
                    <div className={styles.search}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={searchBook}
                        />
                    </div>

                    {isAdmin && (
                        <Link to="/add" className={styles.navLink}>Add a Book</Link>
                    )}

                    <Link to="/saved" className={styles.navLink}>Saved Books</Link>

                    <div className={styles.profileDropdown} ref={profileRef}>
                        <button className={styles.navLink} onClick={() => setIsProfileOpen(!isProfileOpen)}>Profile</button>
                        {isProfileOpen && (
                            <div className={styles.profileDropdownMenu}>
                                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Routes>
                <Route path="/" element={
                    <div className={styles.contentContainer}>
                        <div className={styles.contentBox}>
                            <Container>
                                <Row className="justify-content-md-center">
                                    {bookData.length === 0
                                        ? <p>Not Found</p>
                                        : bookData.map((res, pos) => (
                                            <Card key={pos} book={res} />
                                        ))}
                                </Row>
                            </Container>
                        </div>
                    </div>
                } />
                <Route path="/details/:id" element={<DetailPage books={bookData} />} />
                <Route path="/saved" element={<SavedBooks />} />
                <Route path="/add" element={<AddBook />} />
            </Routes>
        </>
    );
};

export default Main;