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

        // Prepare new recipe object
        const newRecipe = {
            name: document.getElementById('recipeName').value,
            image: document.getElementById('recipeImage').value,
            cookingTime: document.getElementById('cookingTime').value,
            difficulty: document.getElementById('difficulty').value,
            calories: parseInt(document.getElementById('calories').value),
            rating: parseInt(document.getElementById('rating').value),
            reviewCount: 0,
            description: document.getElementById('recipeDescription').value,
            ingredients: ingredients,
            instructions: instructions,
            comments: []
        };

        try {
            // Send the new recipe to the backend
            const response = await fetch('http://localhost:3000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecipe)
            });

            if (!response.ok) {
                throw new Error('Failed to save recipe');
            }

            const savedRecipe = await response.json();
            alert('Recipe added successfully!');
            window.location.href = `recipe-detail.html?id=${savedRecipe.id}`;
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Failed to save recipe. Please try again.');
        }
    });

    // Modified recipe loading function
    async function loadRecipes() {
        try {
            const response = await fetch('http://localhost:3000/api/recipes');
            const data = await response.json();
            return data.recipes;
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
    }
});