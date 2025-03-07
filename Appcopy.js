import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const KEY = "fbbbafe5";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieID, setSelectedMovieID] = useState([]);
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          if (data.Response === "True") {
            setMovies(data.Search);
            setIsLoading(false);
          } else {
            setMovies([]);
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error);
          }
        }
      }
      if (query.length > 2) {
        fetchMovies();
      }

      if (controller) return () => controller.abort();
    },
    [query]
  );
  // console.log(watchedMovies);
  console.log(selectedMovieID);
  return (
    <div className="app-container">
      <Navbar query={query} setQuery={setQuery} />
      <Main>
        <Box>
          <BtnControllDisplay classname={"btn-controllDisplay"} content="-" />
          {!isLoading ? (
            <MovieList
              setIsLoading={setIsLoading}
              setMovieDetails={setMovieDetails}
              selectedMovieID={selectedMovieID}
              setSelectedMovieID={setSelectedMovieID}
              setRating={setRating}
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
              movies={movies}
            />
          ) : (
            <Loading />
          )}
        </Box>
        <Box>
          <BtnControllDisplay classname={"btn-controllDisplay"} content="-" />
          {/* {isLoading && <Loading />} */}
          {selectedMovie ? (
            <MovieDetails
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSelectedMovieID={setSelectedMovieID}
              selectedMovieID={selectedMovieID}
              setSelectedMovie={setSelectedMovie}
              key={selectedMovie.imdbID}
              watchedMovies={watchedMovies}
              setWatchedMovies={setWatchedMovies}
              selectedMovie={selectedMovie}
              rating={rating}
              setRating={setRating}
              setMovieDetails={setMovieDetails}
              movieDetails={movieDetails}
            />
          ) : (
            <WatchList
              movieDetails={movieDetails}
              raiting={rating}
              watchedMovies={watchedMovies}
              setWatchedMovies={setWatchedMovies}
            />
          )}
        </Box>
      </Main>
    </div>
  );
}

function Navbar({ query, setQuery }) {
  const handleSetQuery = (e) => {
    setQuery(e.target.value);
  };
  // console.log(query);

  return (
    <div className="navbar">
      <nav>
        <div className="logo">
          <span>🍿</span>
          <h2>popFlix</h2>
        </div>
        <div className="search">
          <input
            type="text"
            value={query}
            onChange={handleSetQuery}
            placeholder="Search for movies..."
          />
          <button>Search</button>
        </div>
        <div className="results-found">
          <p>Found 10 results</p>
        </div>
      </nav>
    </div>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function BtnControllDisplay({ handleBtnBack, content, classname }) {
  return (
    <button onClick={handleBtnBack} className={classname}>
      {content}
    </button>
  );
}

function MovieList({
  watchedMovies,
  setRating,
  selectedMovie,
  children,
  setSelectedMovie,
  selectedMovieID,
  setIsLoading,
  setMovieDetails,
  setSelectedMovieID,
  movies,
}) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          watchedMovies={watchedMovies}
          selectedMovieID={selectedMovieID}
          setSelectedMovieID={setSelectedMovieID}
          setRating={setRating}
          key={movie.imdbID}
          selectedMovie={selectedMovie}
          id={movie.imdbID}
          image={movie.Poster}
          title={movie.Title}
          year={movie.Year}
          setIsLoading={setIsLoading}
          setMovieDetails={setMovieDetails}
          movie={movie}
          setSelectedMovie={setSelectedMovie}
        >
          <p>
            <span>📅</span>
            {movie.Year}
          </p>
        </MovieCard>
      ))}
    </div>
  );
}

function MovieCard({
  selectedMovieID,
  setSelectedMovieID,
  id,
  movie,
  selectedMovie,
  watchedMovies,
  setSelectedMovie,
  children,
  setIsLoading,
  setMovieDetails,
  image,
  setRating,
  title,
  year,
}) {
  const handleSelected = () => {
    setSelectedMovie(movie);
  };
  // console.log(watchedMovies.includes(movie.imdbID));
  return (
    <div onClick={handleSelected} className="movie-card">
      <div className="movie-image">
        <img src={image} alt="movie" />
      </div>
      <div className="movie-info">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function MovieDetails({
  selectedMovieID,
  watchedMovies,
  setWatchedMovies,
  setSelectedMovieID,
  rating,
  setRating,
  setSelectedMovie,
  movieDetails,
  setMovieDetails,
  selectedMovie,
  isLoading,
  setIsLoading,
}) {
  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?i=${selectedMovie.imdbID}&apikey=${KEY}`
          );
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setMovieDetails(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
      fetchMovieDetails();
    },
    [selectedMovie]
  );

  function handleRating(rating) {
    setRating(rating);
  }

  const {
    Title: title,
    Released: released,
    Genre: genre,
    Poster: poster,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
  } = movieDetails || {};

  const handleWatchedMovies = () => {
    const newWatchedMovies = [...watchedMovies, { ...movieDetails, rating }];
    setWatchedMovies(newWatchedMovies);
    setSelectedMovieID((selectedMovieID) =>
      !selectedMovieID.includes(movieDetails.imdbID)
        ? [...selectedMovieID, movieDetails.imdbID]
        : [...selectedMovieID]
    );
    setSelectedMovie(null);
    setRating(null);
  };

  function handleBtnBack() {
    setSelectedMovie(null);
  }

  return (
    <div className="movie-details">
      <div className="movie-details-top">
        <div className="movie-details-top-left">
          <BtnControllDisplay
            handleBtnBack={handleBtnBack}
            classname="btn-back"
            content={<>&#8592;</>}
          />
          <img src={poster} alt="movie" />
        </div>
        <div className="movie-details-top-right">
          <h2 className="details-title">{title}</h2>
          <p className="details-time">{released}</p>
          <p className="details-genre">{genre}</p>
          <p className="details-rating">
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </div>

      <div className="movie-details-bottom">
        <div className="movie-rating">
          {!selectedMovieID.includes(movieDetails?.imdbID) ? (
            <StarRating
              maxRating={10}
              size={25}
              className={"rating"}
              onSetRating={handleRating}
            />
          ) : (
            <p className="already-watched-text">
              You already watched this movie
            </p>
          )}
        </div>
        {rating > 0 && (
          <button onClick={handleWatchedMovies} className="add-movie">
            Add Movie
          </button>
        )}

        <div className="details-cast">
          <p className="details-story">{plot}</p>
          <p className="details-starring">{actors}</p>
          <p className="details-directed">Directed by {director}</p>
        </div>
      </div>
    </div>
  );
}

function WatchedMovieCard({ image, title, children }) {
  return (
    <div className="watched-movie-card">
      <div className="movie-image">
        <img src={image} alt="movie" />
      </div>
      <div className="movie-info">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function WatchList({ movieDetails, watchedMovies, rating, setWatchedMovies }) {
  return (
    <>
      <div className="watched-header">
        <h3>Movies You Watched</h3>
        <ul className="watched-header-list">
          <li>
            <span>#️⃣</span>2 movies
          </li>
          <li>
            <span>⭐</span>7.20
          </li>
          <li>
            <span>🌟</span>7.00
          </li>
          <li>
            <span>🕑</span>96 mins
          </li>
        </ul>
      </div>
      <div className="watched-list">
        {watchedMovies.map((movie) => (
          <WatchedMovieCard
            key={movie.imdbID}
            title={movie.Title}
            image={movie.Poster}
          >
            <ul className="list-items">
              <li>
                <span>⭐</span>
                {movie.rating}
              </li>
              <li>
                <span>🌟</span>
                {movie.imdbRating}
              </li>
              <li>
                <span>🕑</span>
                {movie.Runtime}
              </li>
              <button className="btn-delete">X</button>
            </ul>
          </WatchedMovieCard>
        ))}
      </div>
      )
    </>
  );
}

function Loading() {
  return (
    <div className="loading">
      <p>Loading...</p>
    </div>
  );
}
