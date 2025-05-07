const API_KEY = '984aecc88245ece7a2d6038a51386040'; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_DETAIL_URL = (id) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;
const TV_DETAIL_URL = (id) => `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`;

// Get the item ID and type from the URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');
const itemType = urlParams.get('type');
const searchQuery = urlParams.get('search');

// Fetch and display the item details
const itemDetailContainer = document.getElementById('item-detail');

function fetchItemDetail() {
    const apiUrl = itemType === 'movie' ? MOVIE_DETAIL_URL(itemId) : TV_DETAIL_URL(itemId);

    fetch(apiUrl)
        .then(response => response.json())
        .then(item => {
            displayItemDetail(item);
        })
        .catch(error => {
            console.error('Error fetching item detail:', error);
            itemDetailContainer.innerHTML = '<div class="card-body"><p>Error loading item details.</p></div>';
        });
}

// Display the item details
function displayItemDetail(item) {
    const backButtonText = searchQuery
        ? 'Back to Search'
        : itemType === 'movie'
        ? 'Back to Movies'
        : 'Back to TV Shows';

    const backButtonUrl = searchQuery
        ? `index.html?search=${searchQuery}`
        : itemType === 'movie'
        ? 'index.html#movies'
        : 'index.html#tv';

    itemDetailContainer.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
        <div class="card-body">
            <h5 class="card-title">${item.title || item.name}</h5>
            <p class="card-text"><strong>Overview:</strong> ${item.overview}</p>
            <p class="card-text"><strong>Release Date:</strong> ${item.release_date || item.first_air_date}</p>
            <p class="card-text"><strong>Rating:</strong> ${item.vote_average} / 10</p>
            <a href="${backButtonUrl}" class="btn btn-primary">${backButtonText}</a>
        </div>
    `;
}

// Fetch and display the item details on page load
fetchItemDetail();