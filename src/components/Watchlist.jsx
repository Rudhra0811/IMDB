import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Watchlist.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const storedWatchlist = localStorage.getItem(`watchlist_${currentUser.id}`);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    }
  }, [currentUser]);

  const removeFromWatchlist = (movieId) => {
    const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
    setWatchlist(updatedWatchlist);
    localStorage.setItem(`watchlist_${currentUser.id}`, JSON.stringify(updatedWatchlist));
  };

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul className="watchlist">
          {watchlist.map(movie => (
            <li key={movie.id}>
              <Link to={`/movie/${movie.id}`}>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                <div>
                  <h3>{movie.title}</h3>
                  <p>{movie.release_date}</p>
                </div>
              </Link>
              <button onClick={() => removeFromWatchlist(movie.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Watchlist;