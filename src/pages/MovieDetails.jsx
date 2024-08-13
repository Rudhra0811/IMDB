import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const API_KEY = 'YOUR_TMDB_API_KEY';
const API_BASE_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>
      <img 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
        alt={movie.title} 
      />
      <p>{movie.overview}</p>
      <h2>Cast</h2>
      <ul>
        {movie.credits.cast.slice(0, 5).map(actor => (
          <li key={actor.id}>{actor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetails;
