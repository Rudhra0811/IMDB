import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">MovieDB</Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;