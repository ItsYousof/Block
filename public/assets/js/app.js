// Function to load apps from JSON
async function loadApps() {
    try {
        const response = await fetch('/data/a.json');
        const apps = await response.json();
        return apps;
    } catch (error) {
        console.error('Error loading apps:', error);
        return [];
    }
}

// Function to create app card HTML
function createAppCard(app) {
    return `
        <div class="game-card" data-categories='${app.categories.join(",")}'>
            <img src="${app.image}" alt="${app.name}">
            <div class="game-card-content">
                <h3>${app.name}</h3>
                <button class="play-btn" onclick="launchApp('${app.link}')">Launch</button>
            </div>
        </div>
    `;
}

// Function to populate apps grid
async function populateApps() {
    const apps = await loadApps();
    const appsGrid = document.getElementById('apps-grid');
    
    if (appsGrid) {
        appsGrid.innerHTML = apps.map(app => createAppCard(app)).join('');
    }
}

// Function to filter apps
function filterApps(searchTerm) {
    const appCards = document.querySelectorAll('#apps-grid .game-card');
    const searchLower = searchTerm.toLowerCase();
    
    appCards.forEach(card => {
        try {
            const appName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const appCategories = card.dataset.categories?.toLowerCase() || '';
            
            if (appName.includes(searchLower) || appCategories.includes(searchLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        } catch (error) {
            console.error('Error filtering app card:', error);
            card.style.display = 'none';
        }
    });
}

// Function to launch app
function launchApp(url) {
    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
}

// Initialize apps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateApps();
    
    // Update app search to use new filter function
    const gameSearch = document.getElementById('game_search');
    if (gameSearch) {
        gameSearch.addEventListener('input', (e) => {
            filterApps(e.target.value);
            filterGames(e.target.value); // Also filter games
        });
    }
});