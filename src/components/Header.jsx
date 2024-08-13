import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Search from './Search';
import './Header.css';

function Header() {
    const { currentUser, logout } = useAuth();

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">MovieDB</Link>
                <Search />
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {currentUser ? (
                            <>
                                <li><Link to="/watchlist">My Watchlist</Link></li>
                                <li><button onClick={logout}>Logout</button></li>
                            </>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;