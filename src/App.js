import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Singup/index";
import Login from "./components/Login/index";
import Main from "./components/Main/index";
import DetailPage from "./components/Main/detailpage";
import SavedBooks from "./components/Main/saved";
import AddBook from "./components/Main/addbook";

import { jwtDecode } from "jwt-decode";

function App() {
  const tokenName = process.env.REACT_APP_TOKEN_NAME || "token";
  const token = localStorage.getItem(tokenName);
  let user = null;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      user = decoded;
      isAdmin = decoded.isAdmin;
    } catch (error) {
      localStorage.removeItem(tokenName);
    }
  }

  return (
    <div>
      <Routes>
        {user ? (
          <>
            {/* Main Page (shown after login) */}
            <Route path="*" element={<Main isAdmin={isAdmin} />} />

            {/* Detail Page (for showing book details) */}
            <Route path="/details/:id" element={<DetailPage isAdmin={isAdmin} />} />

            {/* Saved Books Page */}
            <Route path="/saved" element={<SavedBooks />} />

            {/* Add Book Page (only for admin) */}
            <Route path="/add" element={<AddBook />} />

            {/* Redirect to main if path doesn't match */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            {/* Signup Page */}
            <Route path="/signup" element={<Signup />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Redirect to login if not authenticated */}
            <Route path="*" element={<Navigate replace to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
