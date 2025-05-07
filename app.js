const API_KEY = 'YOUR_API_KEY'; // Replace with your TMDb API key
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const MOVIE_DETAIL_URL = (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

const moviesContainer = document.getElementById('movies');
const detailContent = document.getElementById('detail-content');

// Fetch popular movies from the API
fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        displayMovies(movies);
    })
    .catch(error => console.error('Error fetching movies:', error));

// Function to display movies on the page
function displayMovies(movies) {
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        `;
        movieDiv.addEventListener('click', () => fetchMovieDetail(movie.id));
        moviesContainer.appendChild(movieDiv);
    });
}

// Function to fetch and display movie details
function fetchMovieDetail(movieId) {
    fetch(MOVIE_DETAIL_URL(movieId))
        .then(response => response.json())
        .then(movie => {
            displayMovieDetail(movie);
        })
        .catch(error => console.error('Error fetching movie detail:', error));
}

// Function to display movie details
function displayMovieDetail(movie) {
    detailContent.innerHTML = `
        <h3>${movie.title}</h3>
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
    `;
}