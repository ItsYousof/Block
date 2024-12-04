// Function to load games from JSON
async function loadGames() {
    try {
        const response = await fetch('/data/g.json');
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Error loading games:', error);
        return [];
    }
}

// Function to create game card HTML
function createGameCard(game) {
    return `
        <div class="game-card" data-categories='${game.categories.join(",")}'>
            <img src="${game.image}" alt="${game.name}">
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <button class="play-btn" onclick="playGame('${game.link}')">Play Now</button>
            </div>
        </div>
    `;
}

// Function to populate games grid
async function populateGames() {
    const games = await loadGames();
    const gamesGrid = document.getElementById('all-games-grid');

    if (gamesGrid) {
        gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
    }
}

// Function to filter games
function filterGames(searchTerm) {
    const gameCards = document.querySelectorAll('.game-card');
    const searchLower = searchTerm.toLowerCase();

    gameCards.forEach(card => {
        try {
            const gameName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const gameCategories = card.dataset.categories?.toLowerCase() || '';

            if (gameName.includes(searchLower) || gameCategories.includes(searchLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        } catch (error) {
            console.error('Error filtering game card:', error);
            card.style.display = 'none';
        }
    });
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateGames();

    // Update game search to use new filter function
    const gameSearch = document.getElementById('game_search');
    if (gameSearch) {
        gameSearch.addEventListener('input', (e) => filterGames(e.target.value));
    }
});

function playGame(url) {
    if (url === "RETRO") {
        window.location.href = "/assets/games/retrobowl/index.html";
    } else {
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(checker(url));
    }
}

function checker(url) {
    let searchUrl = 'https://www.google.com/search?q=';
    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            // if no http or https is detected, add https automatically
            url = "https://" + url;
        }
    }

    return url;
}
