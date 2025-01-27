class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.username = 'agar'; // Hardcoded for now, ideally would come from login
    }

    // Load favorites from a JSON file
    async loadFavorites() {
        try {
            const response = await fetch('../Json/users.json');
            const data = await response.json();
            const user = data.users.find(u => u.username === this.username);
            return user ? user['favorite recipes ID'] : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    // Save favorites to JSON file (requires backend support)
    async saveFavorites() {
        try {
            const response = await fetch('/api/saveFavorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: this.username, 
                    'favorite recipes ID': this.favorites 
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save favorites');
            }
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    // Add recipe to favorites
    async addFavorite(recipeId) {
        await this.loadFavorites();
        if (!this.favorites.includes(recipeId)) {
            this.favorites.push(recipeId);
            await this.saveFavorites();
        }
    }

    // Remove recipe from favorites
    async removeFavorite(recipeId) {
        await this.loadFavorites();
        this.favorites = this.favorites.filter(id => id !== recipeId);
        await this.saveFavorites();
    }

    // Check if recipe is a favorite
    async isFavorite(recipeId) {
        const favorites = await this.loadFavorites();
        return favorites.includes(recipeId);
    }

    // Get all favorite recipes
    async getFavoriteRecipes() {
        try {
            const favorites = await this.loadFavorites();
            const response = await fetch('../Json/recipes.json');
            const data = await response.json();
            return data.recipes.filter(recipe => favorites.includes(recipe.id));
        } catch (error) {
            console.error('Error loading favorite recipes:', error);
            return [];
        }
    }
}

// Create global instance
window.favoritesManager = new FavoritesManager();

// Add event listeners for favorite buttons
async function setupFavoriteButton() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        // Get recipe ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('id'));

        // Update initial favorite state
        const isFavorite = await window.favoritesManager.isFavorite(recipeId);
        if (isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Added to Favorites
            `;
        }

        // Toggle favorite on button click
        favoriteBtn.addEventListener('click', async function() {
            this.classList.toggle('active');
            const isFavorite = this.classList.contains('active');
            
            if (isFavorite) {
                await window.favoritesManager.addFavorite(recipeId);
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Added to Favorites
                `;
            } else {
                await window.favoritesManager.removeFavorite(recipeId);
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Add to Favorite
                `;
            }
        });
    }
}

// Function to display favorites on profile page
async function displayFavoriteRecipes() {
    const favoritesContainer = document.querySelector('.favorites-container');
    if (favoritesContainer) {
        const favoriteRecipes = await window.favoritesManager.getFavoriteRecipes();
        
        favoritesContainer.innerHTML = ''; // Clear existing content
        
        if (favoriteRecipes.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorite recipes yet.</p>';
            return;
        }
        
        favoriteRecipes.forEach(recipe => {
            const articleElement = document.createElement('article');
            articleElement.classList.add('recipe-card');
            articleElement.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" loading="lazy">
                <div class="recipe-details">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span class="cooking-time">⏰ ${recipe.cookingTime}</span>
                        <span class="difficulty">🔥 ${recipe.difficulty}</span>
                        <span class="calories">🍽️ ${recipe.calories} Cal</span>
                    </div>
                    <div class="recipe-review">
                        <div class="stars">${'★'.repeat(recipe.rating)}${'☆'.repeat(5 - recipe.rating)}</div>
                        <span class="review-count">(${recipe.reviewCount} reviews)</span>
                    </div>
                </div>
            `;
            
            articleElement.addEventListener('click', () => {
                window.location.href = `recipe-detail.html?id=${recipe.id}`;
            });
            
            favoritesContainer.appendChild(articleElement);
        });
    }
}

// Set up event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    setupFavoriteButton();
    displayFavoriteRecipes();
});