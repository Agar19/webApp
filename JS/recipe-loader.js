class RecipeManager {
    constructor() {
        this.recipes = [];
        this.initialized = false;
    }

    // Load recipes from the recipes.json file
    async initialize() {
        if (this.initialized) return;

        try {
            // Fetch recipes from the recipes.json file
            const response = await fetch('/Json/recipes.json'); 
            const data = await response.json();
            this.recipes = data.recipes;
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

    // Display recipes in json and html
    displayInContainer() {
        const recipeContainers = document.querySelectorAll('.recipe-container');
        
        if (recipeContainers.length) {
            recipeContainers.forEach((container, index) => {
                container.innerHTML = '';
            
                const sectionRecipes = this.recipes.slice(index * 6, (index + 1) * 6);
                
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
                        window.location.href = `../pages/recipe-detail?id=${recipe.id}`;
                    });
                    
                    container.appendChild(articleElement);
                });
            });
        }
    }
}
//recipe detail page ruu data oruulah
async function displayRecipeDetails() {
    const recipeDetailContainer = document.querySelector('.recipe-detail');
    if (recipeDetailContainer) {
        // Get recipe ID
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('id'));

        try {
            // Fetch recipes from JSON
            const response = await fetch('../Json/recipes.json');
            const data = await response.json();
            const recipe = data.recipes.find(r => r.id === recipeId);

            if (recipe) {
              
                recipeDetailContainer.querySelector('.recipe-hero img').src = recipe.image;
                recipeDetailContainer.querySelector('.recipe-hero h1').textContent = recipe.name;
               
                const metaElements = recipeDetailContainer.querySelectorAll('.recipe-meta span');
                metaElements[0].textContent = `⏰ ${recipe.cookingTime}`;
                metaElements[1].textContent = `🔥 ${recipe.difficulty}`;
                metaElements[2].textContent = `🍽️ ${recipe.calories} Cal`;

               
                const starsElement = recipeDetailContainer.querySelector('.recipe-review .stars');
                const reviewCountElement = recipeDetailContainer.querySelector('.recipe-review .review-count');
                starsElement.textContent = '★'.repeat(recipe.rating) + '☆'.repeat(5 - recipe.rating);
                reviewCountElement.textContent = `(${recipe.reviewCount} reviews)`;

            
                const descriptionElement = recipeDetailContainer.querySelector('.recipe-hero-details p');
                descriptionElement.textContent = recipe.description;

                
                const ingredientsList = recipeDetailContainer.querySelector('.ingredients ul');
                ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

             
                const instructionsList = recipeDetailContainer.querySelector('.instructions ol');
                instructionsList.innerHTML = recipe.instructions.map(inst => `<li>${inst}</li>`).join('');

                
                const commentsSection = recipeDetailContainer.querySelector('.comments');
                const commentsContainer = commentsSection.querySelector('.comment-list');
                commentsContainer.innerHTML = recipe.comments.map(comment => `
                    <div class="comment">
                        <strong>${comment.user}</strong>
                        <p>${comment.text}</p>
                    </div>
                `).join('');
            } else {
                console.error('Recipe not found');
            }
        } catch (error) {
            console.error('Error loading recipe details:', error);
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', displayRecipeDetails);

// Create a global instance
window.recipeManager = new RecipeManager();

// Initialize when the document loads
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize recipe manager
    await window.recipeManager.initialize();

    // Handle different page displays
    if (document.querySelector('.recipe-container')) {
        window.recipeManager.displayInContainer();
    }
});
