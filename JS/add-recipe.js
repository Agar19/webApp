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

    // Load existing recipes and add new recipe
    async function addRecipeToJSON(newRecipe) {
        try {
            // Load existing recipes
            const response = await fetch('../Json/recipes.json');
            const data = await response.json();
            
            // Generate new ID
            const maxId = Math.max(...data.recipes.map(recipe => recipe.id), 0);
            newRecipe.id = maxId + 1;
            
            // Add new recipe to array
            data.recipes.push(newRecipe);
            
            // Save updated recipes using the server endpoint
            const saveResponse = await fetch('http://localhost:3000/save-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!saveResponse.ok) {
                const errorData = await saveResponse.json();
                throw new Error(errorData.details || 'Failed to save recipe');
            }

            return newRecipe;
        } catch (error) {
            console.error('Error saving recipe:', error);
            throw error;
        }
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect ingredients
        const ingredientInputs = document.querySelectorAll('input[name="ingredient"]');
        const ingredients = Array.from(ingredientInputs).map(input => input.value);

        // Collect instructions
        const instructionInputs = document.querySelectorAll('input[name="instruction"]');
        const instructions = Array.from(instructionInputs).map(input => input.value);

        // Collect meal types
        const mealTypeInputs = document.querySelectorAll('input[name="mealType"]:checked');
        const mealTypes = Array.from(mealTypeInputs).map(input => input.value);

        // Collect dietary preferences
        const dietaryInputs = document.querySelectorAll('input[name="dietary"]:checked');
        const dietary = Array.from(dietaryInputs).reduce((acc, input) => {
            acc[input.value] = true;
            return acc;
        }, {
            IsMeat: false,
            IsVegan: false,
            IsVegetarian: false,
            IsDessert: false
        });

        // Prepare new recipe object
        const newRecipe = {
            name: document.getElementById('recipeName').value,
            image: document.getElementById('recipeImage').value,
            cookingTime: document.getElementById('cookingTime').value,
            difficulty: document.getElementById('difficulty').value,
            calories: parseInt(document.getElementById('calories').value),
            rating: 0,
            reviewCount: 0,
            description: document.getElementById('recipeDescription').value,
            ingredients: ingredients,
            instructions: instructions,
            MealType: mealTypes,
            ...dietary,
            comments: []
        };

        try {
            const savedRecipe = await addRecipeToJSON(newRecipe);
            alert('Recipe added successfully!');
            window.location.href = `recipe-detail.html?id=${savedRecipe.id}`;
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert(`Failed to save recipe: ${error.message}`);
        }
    });

    // Modified recipe loading function
    async function loadRecipes() {
        try {
            const response = await fetch('../Json/recipes.json');
            const data = await response.json();
            return data.recipes;
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
    }
});