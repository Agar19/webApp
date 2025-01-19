// recipe-loader.js
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.initialized = false;
    }

    // Load recipes once and store them
    async initialize() {
        if (this.initialized) return;

        try {
            // Check localStorage first
            const storedRecipes = localStorage.getItem('recipes');
            if (storedRecipes) {
                this.recipes = JSON.parse(storedRecipes).recipes;
            } else {
                // Fetch from API if not in localStorage
                const response = await fetch('/api/recipes');
                const data = await response.json();
                this.recipes = data.recipes;
                localStorage.setItem('recipes', JSON.stringify(data));
            }
            this.initialized = true;
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.recipes = [];
        }
    }

    // Get all recipes
    getAllRecipes() {
        return this.recipes;
    }

    // Get a specific recipe by ID
    getRecipeById(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }

    // Display recipes in slider containers
    displayInSliders() {
        const sliderContainers = document.querySelectorAll('.slider-container');
        
        if (sliderContainers.length) {
            sliderContainers.forEach((container, index) => {
                container.innerHTML = ''; // Clear existing content
                
                // Slice recipes based on the section 
                const sectionRecipes = this.recipes.slice(index * 3, (index + 1) * 3);
                
                sectionRecipes.forEach(recipe => {
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
                        router.route({ target: { getAttribute: () => `/recipe/${recipe.id}` } });
                    });
                    
                    container.appendChild(articleElement);
                });
            });
        }
    }

    // Display recipe details
    displayRecipeDetails() {
        const recipeDetailContainer = document.querySelector('.recipe-detail');
        if (!recipeDetailContainer) return;

        const pathParts = window.location.pathname.split('/');
        const recipeId = parseInt(pathParts[pathParts.length - 1]);
        const recipe = this.getRecipeById(recipeId);

        if (recipe) {
            // Your existing recipe detail display code...
            recipeDetailContainer.querySelector('.recipe-hero img').src = recipe.image;
            recipeDetailContainer.querySelector('.recipe-hero h1').textContent = recipe.name;
            // ... rest of your detail display code
        }
    }
}

// Create a global instance
window.recipeManager = new RecipeManager();

// Initialize when the document loads
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize recipe manager
    await window.recipeManager.initialize();

    // Handle different page displays
    if (document.querySelector('.slider-container')) {
        window.recipeManager.displayInSliders();
    }

    if (document.querySelector('.recipe-detail')) {
        window.recipeManager.displayRecipeDetails();
    }
});