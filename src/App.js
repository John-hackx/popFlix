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
  const [isWatchedOpen, setIsWatchedOpen] = useState(false);

  const windowWidth = window.innerWidth;
  // if (windowWidth <= 810) {
  //   setIsMobileView(true);
  // }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
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
  console.log(watchedMovies);
  // console.log(selectedMovieID);
  return (
    <div className="app-container">
      <Navbar movies={movies} query={query} setQuery={setQuery} />
      <Main>
        {windowWidth <= 810 && (
          <ViewWatched
            watchedMovies={watchedMovies}
            isWatchedOpen={isWatchedOpen}
            setIsWatchedOpen={setIsWatchedOpen}
          />
        )}
        <Box>
          {windowWidth <= 810 ? (
            !movieDetails ? (
              //watched movies not opened
              !isWatchedOpen && (
                <>
                  <BtnControllDisplay
                    classname={"btn-controllDisplay"}
                    content="-"
                  />

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
                </>
              )
            ) : (
              //watched movies not opened
              !isWatchedOpen && (
                <>
                  <BtnControllDisplay
                    classname={"btn-controllDisplay"}
                    content="-"
                  />

                  <MovieDetails
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setSelectedMovieID={setSelectedMovieID}
                    selectedMovieID={selectedMovieID}
                    setSelectedMovie={setSelectedMovie}
                    key={selectedMovie?.imdbID}
                    watchedMovies={watchedMovies}
                    setWatchedMovies={setWatchedMovies}
                    selectedMovie={selectedMovie}
                    rating={rating}
                    setRating={setRating}
                    setMovieDetails={setMovieDetails}
                    movieDetails={movieDetails}
                  />
                  {/* {movieDetails ? (
                ) : (
                  <WatchList
                    movieDetails={movieDetails}
                    raiting={rating}
                    watchedMovies={watchedMovies}
                    setWatchedMovies={setWatchedMovies}
                  />
                )} */}
                </>
              )
            )
          ) : (
            //Not mobile view
            <>
              <BtnControllDisplay
                classname={"btn-controllDisplay"}
                content="-"
              />

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
            </>
          )}
          {isWatchedOpen && (
            <WatchList
              movieDetails={movieDetails}
              raiting={rating}
              watchedMovies={watchedMovies}
              setWatchedMovies={setWatchedMovies}
            />
          )}
        </Box>
        {!(windowWidth <= 810) && (
          <Box>
            <BtnControllDisplay classname={"btn-controllDisplay"} content="-" />

            {movieDetails ? (
              <MovieDetails
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setSelectedMovieID={setSelectedMovieID}
                selectedMovieID={selectedMovieID}
                setSelectedMovie={setSelectedMovie}
                key={selectedMovie?.imdbID}
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
        )}
      </Main>
    </div>
  );
}

function ViewWatched({ watchedMovies, setIsWatchedOpen, isWatchedOpen }) {
  const handleViewWatched = () => {
    setIsWatchedOpen(!isWatchedOpen);
  };

  return (
    <div className="view-watched" role="button" onClick={handleViewWatched}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
        </svg>
      </span>
      <p>Watched</p>
    </div>
  );
}

function Navbar({ movies, query, setQuery }) {
  const [isSearchClose, setIsSearchClose] = useState(false);
  const [isSearchIcon, setIsSearchIcon] = useState(true);

  const handleSetQuery = (e) => {
    setQuery(e.target.value);
  };
  // console.log(query);

  const handleMobilesearch = (e) => {
    e.preventDefault();
    setIsSearchIcon(false);
    document.querySelector(".logo").style.display = "none";
    document.querySelector(".search").style.display = "block";
    document.querySelector(".search input").focus();
    setIsSearchClose(true);
  };

  const handleSearchClose = (e) => {
    e.preventDefault();
    setIsSearchIcon(true);
    document.querySelector(".logo").style.display = "flex";
    document.querySelector(".search").style.display = "none";
  };

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
          {isSearchClose && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              onClick={handleSearchClose}
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          )}
          {/* <button>Search</button> */}
        </div>
        <div className="results-found">
          <p>Found {movies.length} results</p>
        </div>
        {/* mobile view */}
        {isSearchIcon && (
          <div className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              onClick={handleMobilesearch}
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>
        )}
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
  useEffect(
    function () {
      async function fetchMovieDetails() {
        // setIsLoading(true);
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?i=${selectedMovie?.imdbID}&apikey=${KEY}`
          );
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setMovieDetails(data);
          // setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
      fetchMovieDetails();
    },
    [selectedMovie]
  );

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          watchedMovies={watchedMovies}
          selectedMovieID={selectedMovieID}
          setSelectedMovieID={setSelectedMovieID}
          setRating={setRating}
          key={movie?.imdbID}
          selectedMovie={selectedMovie}
          id={movie?.imdbID}
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
    console.log("hii");
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

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "popFlix";
      };
    },
    [title]
  );

  function handleBtnBack() {
    setSelectedMovie(null);
    setMovieDetails(null);
  }

  useEffect(function () {
    const handleCallBack = (e) => {
      if (e.code === "Escape") {
        handleBtnBack();
        console.log("closing shit");
      }
    };

    document.addEventListener("keydown", handleCallBack);

    return function () {
      document.removeEventListener("keydown", handleCallBack);
    };
  }, []);

  const handleWatchedMovies = () => {
    const newWatchedMovies = [...watchedMovies, { ...movieDetails, rating }];
    setWatchedMovies(newWatchedMovies);
    setSelectedMovieID((selectedMovieID) =>
      !selectedMovieID.includes(movieDetails?.imdbID)
        ? [...selectedMovieID, movieDetails?.imdbID]
        : [...selectedMovieID]
    );
    setSelectedMovie(null);
    setRating(null);
    setMovieDetails(null);
  };

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
  const sumOfRating = watchedMovies?.reduce((acc, cur) => acc + cur.rating, 0);
  const averageRating = sumOfRating / watchedMovies?.length;

  const sumOfImdbRating = watchedMovies?.reduce(
    (acc, cur) => acc + Number(cur.imdbRating),
    0
  );
  const averageImdbRating = sumOfImdbRating / watchedMovies?.length;

  const averageRuntime =
    watchedMovies?.reduce((acc, cur) => acc + parseInt(cur.Runtime), 0) /
    watchedMovies?.length;
  // console.log(averageRuntime);

  const handleDeleteMovie = (id) => {
    const filteredArray = watchedMovies?.filter((movie) => movie.imdbID !== id);
    setWatchedMovies(filteredArray);
    console.log(id);
  };

  return (
    <>
      <div className="watched-header">
        <h3>Movies You Watched</h3>
        <ul className="watched-header-list">
          <li>
            <span>#️⃣</span>
            {watchedMovies?.length}{" "}
            {watchedMovies?.length < 2 && watchedMovies?.length !== 0
              ? "movie"
              : "movies"}
          </li>
          <li>
            <span>⭐</span>
            {watchedMovies?.length > 0 ? averageRating.toFixed(2) : "0"}
          </li>
          <li>
            <span>🌟</span>
            {watchedMovies?.length > 0 ? averageImdbRating.toFixed(2) : "0"}
          </li>
          <li>
            <span>🕑</span>
            {watchedMovies?.length > 0 ? averageRuntime : "0"} mins
          </li>
        </ul>
      </div>
      <div className="watched-list">
        {watchedMovies?.map((movie) => (
          <WatchedMovieCard
            key={movie?.imdbID}
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
              <button
                onClick={() => handleDeleteMovie(movie.imdbID)}
                className="btn-delete"
              >
                X
              </button>
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
      {document.activeElement === document.querySelector(".search input") && (
        <p>Loading...</p>
      )}
      {/* <p>Loading...</p> */}
    </div>
  );
}
