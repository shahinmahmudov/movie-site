import { useState, useEffect, createContext } from "react";
import axios from "axios";
import "./Css/style.css";

const API_KEY = "db568b26";
const DEFAULT_SEARCH = "Harry";

// Wishlist Context
const WishlistContext = createContext();

function App() {
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://www.omdbapi.com/?s=${search}&apikey=${API_KEY}`)
      .then((response) => {
        setMovies(response.data.Search);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.search.value.trim());
  };

  const addToWishlist = (movie) => {
    const isItemInWishlist = wishlist.some(
      (item) => item.imdbID === movie.imdbID
    );

    if (!isItemInWishlist) {
      setWishlist((prevWishlist) => [...prevWishlist, movie]);
    }
  };

  const toggleWishlist = () => {
    setIsWishlistOpen((prevState) => !prevState);
  };

  console.log(wishlist.length);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist }}>
      <nav
        style={{ backgroundColor: "black", color: "white", padding: "10px" }}
      >
        NavBar
        <form onSubmit={handleSearch} style={{ marginTop: "10px" }}>
          <input
            type="text"
            name="search"
            defaultValue={DEFAULT_SEARCH}
            style={{ marginRight: "10px" }}
          />
          <button type="submit">Search</button>
          <button onClick={toggleWishlist} style={{ marginLeft: "10px" }}>
            Wishlist<sup>{wishlist.length}</sup>
          </button>
        </form>
      </nav>
      <header>
        <div style={{ margin: "0 auto" }}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {movies &&
                movies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    style={{
                      margin: "10px",
                      border: "1px solid black",
                      borderRadius: "5px",
                      width: "300px",
                      backgroundColor: "white",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        borderRadius: "5px 5px 0 0",
                      }}
                    />
                    <div style={{ padding: "10px" }}>
                      <h2 style={{ margin: "0", fontSize: "1.5rem" }}>
                        {movie.Title}
                      </h2>
                      <p style={{ margin: "5px 0 0 0" }}>{movie.Year}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => addToWishlist(movie)}
                        type="submit"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "0 0 5px 5px",
                          cursor: "pointer",
                        }}
                      >
                        Wish
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </header>
      {isWishlistOpen && (
        <>
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "0",
              background: "gray",
              padding: "10px",
              marginTop: "10px",
              width: "300px",
              height: "500px",
              overflow: "scroll",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              Wishlist
            </h3>
            {wishlist.map((movie) => (
              <div key={movie.imdbID}>
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  style={{
                    width: "200px",
                    height: "225px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                />
                <p style={{ textAlign: "center", margin: "0" }}>
                  {movie.Title} ({movie.Year})
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </WishlistContext.Provider>
  );
}

export default App;
