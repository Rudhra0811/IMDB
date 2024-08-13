import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Search.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies..."
                />
                <button type="submit">Search</button>
            </form>
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map(movie => (
                        <li key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                            <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <div>
                                <h4>{movie.title}</h4>
                                <p>{movie.release_date}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Search;