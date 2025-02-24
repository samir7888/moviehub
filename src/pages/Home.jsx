import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import "../css/Home.css";
import { getPopularMovies, searchMovies } from "../services/api";
const Home = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    if(!search.trim()) return;  
    if(loading) return;
    setLoading(true);
    try {
        const searchResults = await searchMovies(search);
        setMovies(searchResults);
        setError(null); 
    } catch (error) {
        console.log(error);
        setError("Error fetching movies. Try again later.");
    }finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);
  return (
    <div className="home">
      <form onSubmit={handleSubmit} className="search-form">
        <input
        className="search-input"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          value={search}
          placeholder="Search..."
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading....</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
