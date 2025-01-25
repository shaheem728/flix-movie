import React, { useEffect, useState } from "react";
import "./App.css";
import {updateSearchCount,getTrendingMovies} from "./appwrite"
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import {useDebounce} from 'react-use'
const App = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearhTerm,setdeboundSearchTerm] = useState('')
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [listMovies, setListMovies] = useState();
  const API_BASE_URL = "http://www.omdbapi.com"
  useDebounce(()=>setdeboundSearchTerm(searchTerm),500,[searchTerm])//waiting for the user to stop typing for 500ms
  const API_KEY = import.meta.env.VITE_SECRET_KEY;
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
      ? `${API_BASE_URL}?apikey=${API_KEY}&s=${query}`
      : `${API_BASE_URL}?apikey=${API_KEY}&s=${listMovies}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "No movies found");
        setMovies([]);
      } else {
        setMovies(data.Search);
        if(query && data.Search.length>0){
         await  updateSearchCount(query,data.Search[0])
        }
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  //show trending movies
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
      setListMovies(movies[0].searchTerm)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }
  // Fetch movies only when searchTerm changes and debounce the calls
  useEffect(() => {
    fetchMovies(debouncedSearhTerm);
  }, [debouncedSearhTerm]);
  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img
              src="/hero-img.png"
              alt="Hero"
              onError={(e) => (e.target.style.display = "none")}
            />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  {
                  movie.poster_url !== "N/A" ? (<img src={movie.poster_url} alt={movie.$id}/>):<img src='No-Poster.png' alt="No-Poster"/>
                  } 
                </li>
              ))}
            </ul>
          </section>
        )}
          <section className="all-movies">
            <h2 className="mt-5">All Movies</h2>
            {isLoading ? (
              <Spinner/>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
