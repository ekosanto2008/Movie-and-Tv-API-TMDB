const API_KEY = 'YOUR_API_KEY'; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const TV_API_URL = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
const SEARCH_API_URL = (query) => `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1`;

const itemsContainer = document.getElementById('items');
const pageTitle = document.getElementById('page-title');
const movieListTab = document.getElementById('movie-list');
const tvListTab = document.getElementById('tv-list');
const searchInput = document.getElementById('search-input');

let searchQuery = ''; // Tracks the current search query

// Helper function: Add shimmer effect
function showShimmer() {
    itemsContainer.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        itemsContainer.innerHTML += `
            <div class="col-md-3 my-3">
                <div class="card shimmer-card shimmer"></div>
            </div>
        `;
    }
}

// Helper function: Toggle active class in navbar
function setActiveTab(tabId) {
    document.getElementById('nav-movie').classList.remove('active');
    document.getElementById('nav-tv').classList.remove('active');
    document.getElementById(tabId).classList.add('active');
}

// Fetch and display items (movies, TV shows, or search results)
function fetchAndDisplayItems(apiUrl, title = 'Popular Movies/TV Shows', isSearch = false) {
    pageTitle.innerText = title;
    showShimmer(); // Show shimmer while loading

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const items = data.results;
            if (items && items.length > 0) {
                displayItems(items);
            } else if (isSearch) {
                fetchAndDisplayItems(MOVIE_API_URL, 'Popular Movies'); // Default back to popular movies
            } else {
                itemsContainer.innerHTML = '<p class="text-center w-100">No items found.</p>';
            }
        })
        .catch(error => console.error('Error fetching items:', error));
}

// Display items in a Bootstrap card grid
function displayItems(items) {
    itemsContainer.innerHTML = ''; // Clear shimmer
    items.forEach(item => {
        const itemCard = `
            <div class="col-md-3 my-3">
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" class="card-img-top" alt="${item.title || item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title || item.name}</h5>
                        <button class="btn btn-primary" onclick="viewDetail(${item.id}, '${item.media_type || (item.title ? 'movie' : 'tv')}')">View Details</button>
                    </div>
                </div>
            </div>
        `;
        itemsContainer.innerHTML += itemCard;
    });
}

// Navigate to the detail page
function viewDetail(itemId, type) {
    const searchSession = searchQuery ? `&search=${searchQuery}` : '';
    window.location.href = `detail.html?id=${itemId}&type=${type}${searchSession}`;
}

// Autocomplete functionality for the search bar
$(function () {
    $('#search-input').on('input', function () {
        const query = this.value.trim();
        searchQuery = query;
        if (query) {
            fetch(SEARCH_API_URL(query))
                .then(res => res.json())
                .then(data => {
                    const items = data.results;
                    if (items && items.length > 0) {
                        displayItems(items);
                    } else {
                        fetchAndDisplayItems(MOVIE_API_URL, 'Popular Movies'); // Default back to popular movies
                    }
                });
        } else {
            fetchAndDisplayItems(MOVIE_API_URL, 'Popular Movies'); // Default back to popular movies
        }
    });
});

// Event Listener for Navbar
movieListTab.addEventListener('click', () => {
    setActiveTab('nav-movie');
    fetchAndDisplayItems(MOVIE_API_URL, 'Popular Movies');
});
tvListTab.addEventListener('click', () => {
    setActiveTab('nav-tv');
    fetchAndDisplayItems(TV_API_URL, 'Popular TV Shows');
});

// Default to Movies on Page Load
fetchAndDisplayItems(MOVIE_API_URL, 'Popular Movies');