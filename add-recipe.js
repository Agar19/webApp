document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addRecipeForm');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const addInstructionBtn = document.getElementById('addInstructionBtn');
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const instructionsContainer = document.getElementById('instructionsContainer');

    // Dynamic ingredient addition
    addIngredientBtn.addEventListener('click', () => {
        const ingredientSection = document.createElement('div');
        ingredientSection.classList.add('ingredient-section');
        ingredientSection.innerHTML = `
            <input type="text" name="ingredient" placeholder="Enter ingredient" required>
            <button type="button" class="btn-remove">Remove</button>
        `;
        ingredientsContainer.appendChild(ingredientSection);

        // Remove ingredient section
        ingredientSection.querySelector('.btn-remove').addEventListener('click', () => {
            ingredientsContainer.removeChild(ingredientSection);
        });
    });

    // Dynamic instruction addition
    addInstructionBtn.addEventListener('click', () => {
        const instructionSection = document.createElement('div');
        instructionSection.classList.add('instruction-section');
        instructionSection.innerHTML = `
            <input type="text" name="instruction" placeholder="Enter instruction step" required>
            <button type="button" class="btn-remove">Remove</button>
        `;
        instructionsContainer.appendChild(instructionSection);

        // Remove instruction section
        instructionSection.querySelector('.btn-remove').addEventListener('click', () => {
            instructionsContainer.removeChild(instructionSection);
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect ingredients
        const ingredientInputs = document.querySelectorAll('input[name="ingredient"]');
        const ingredients = Array.from(ingredientInputs).map(input => input.value);

        // Collect instructions
        const instructionInputs = document.querySelectorAll('input[name="instruction"]');
        const instructions = Array.from(instructionInputs).map(input => input.value);

        // Load existing recipes
        let recipes;
        try {
            const response = await fetch('recipes.json');
            const data = await response.json();
            recipes = data.recipes;
        } catch (error) {
            console.error('Error loading existing recipes:', error);
            recipes = [];
        }

        // Prepare new recipe object
        const newRecipe = {
            id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
            name: document.getElementById('recipeName').value,
            image: document.getElementById('recipeImage').value,
            cookingTime: document.getElementById('cookingTime').value,
            difficulty: document.getElementById('difficulty').value,
            calories: parseInt(document.getElementById('calories').value),
            rating: parseInt(document.getElementById('rating').value),
            reviewCount: 0, // Default to 0 for new recipes
            description: document.getElementById('recipeDescription').value,
            ingredients: ingredients,
            instructions: instructions,
            comments: [] // Start with no comments
        };

        // Add new recipe to existing recipes
        recipes.push(newRecipe);

        // Update the entire recipes object
        const updatedRecipesData = { recipes: recipes };

        // In a real-world scenario, you'd typically send this to a backend
        // For this example, we'll use localStorage to simulate persistence
        localStorage.setItem('recipes', JSON.stringify(updatedRecipesData));

        alert('Recipe added successfully!');
        window.location.href = `recipe-detail.html?id=${newRecipe.id}`;
    });

    // Modify recipe-loader.js to first check localStorage
    async function loadRecipes() {
        // Check localStorage first
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            return JSON.parse(storedRecipes).recipes;
        }

        // If no localStorage, fetch from JSON file //i want to Change This so that i can use my recipe.json file to be my database
        try {
            const response = await fetch('recipes.json');
            const data = await response.json();
            return data.recipes;
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
    }
});