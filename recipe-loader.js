document.addEventListener('DOMContentLoaded', () => {
    // Load Json
    async function loadRecipes() {
        // Check localStorage first
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            return JSON.parse(storedRecipes).recipes;
        }

        // If no localStorage, fetch from JSON file
        try {
            const response = await fetch('recipes.json');
            const data = await response.json();
            return data.recipes;
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
    }

    // Function to create recipe cards on main page
    async function displayRecipeCards() {
        const recipes = await loadRecipes();
        const sliderContainers = document.querySelectorAll('.slider-container');

        if (sliderContainers.length) {
            sliderContainers.forEach((container, index) => {
                container.innerHTML = ''; // Clear existing content
                
                // Slice recipes based on the section 
                const sectionRecipes = recipes.slice(index * 3, (index + 1) * 3);
                
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
                    
                    // Add click event to navigate to recipe detail
                    articleElement.addEventListener('click', () => {
                        window.location.href = `recipe-detail.html?id=${recipe.id}`;
                    });
                    
                    container.appendChild(articleElement);
                });
            });
        }
    }

    // Function to display recipe details on detail page
    async function displayRecipeDetails() {
        const recipeDetailContainer = document.querySelector('.recipe-detail');
        if (recipeDetailContainer) {
            // Get recipe ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const recipeId = parseInt(urlParams.get('id'));

            const recipes = await loadRecipes();
            const recipe = recipes.find(r => r.id === recipeId);

            if (recipe) {
                // Update hero section
                recipeDetailContainer.querySelector('.recipe-hero img').src = recipe.image;
                recipeDetailContainer.querySelector('.recipe-hero h1').textContent = recipe.name;
                
                // Update meta information
                const metaElements = recipeDetailContainer.querySelectorAll('.recipe-meta span');
                metaElements[0].textContent = `⏰ ${recipe.cookingTime}`;
                metaElements[1].textContent = `🔥 ${recipe.difficulty}`;
                metaElements[2].textContent = `🍽️ ${recipe.calories} Cal`;

                // Update review section
                const starsElement = recipeDetailContainer.querySelector('.recipe-review .stars');
                const reviewCountElement = recipeDetailContainer.querySelector('.recipe-review .review-count');
                starsElement.textContent = '★'.repeat(recipe.rating) + '☆'.repeat(5 - recipe.rating);
                reviewCountElement.textContent = `(${recipe.reviewCount} reviews)`;

                // Update description
                const descriptionElement = recipeDetailContainer.querySelector('.recipe-hero-details p');
                descriptionElement.textContent = recipe.description;

                // Populate ingredients
                const ingredientsList = recipeDetailContainer.querySelector('.ingredients ul');
                ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

                // Populate instructions
                const instructionsList = recipeDetailContainer.querySelector('.instructions ol');
                instructionsList.innerHTML = recipe.instructions.map(inst => `<li>${inst}</li>`).join('');

                // Populate comments
                const commentsSection = recipeDetailContainer.querySelector('.comments');
                const commentsContainer = commentsSection.querySelector('.comment-list');
                commentsContainer.innerHTML = recipe.comments.map(comment => `
                    <div class="comment">
                        <strong>${comment.user}</strong>
                        <p>${comment.text}</p>
                    </div>
                `).join('');
            }
        }
    }

    // Determine which function to run based on current page
    if (document.querySelector('.slider-container')) {
        displayRecipeCards();
    }

    if (document.querySelector('.recipe-detail')) {
        displayRecipeDetails();
    }
});