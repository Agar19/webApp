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

        instructionSection.querySelector('.btn-remove').addEventListener('click', () => {
            instructionsContainer.removeChild(instructionSection);
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();

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

        // Get the image file
        const imageInput = document.getElementById('recipeImage');
        const imageFile = imageInput.files[0];
        if (!imageFile) {
            alert('Please select an image file');
            return;
        }

        // Prepare recipe data
        const recipeData = {
            name: document.getElementById('recipeName').value,
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

        // Add recipe data and image to FormData
        formData.append('recipeData', JSON.stringify(recipeData));
        formData.append('recipeImage', imageFile);

        try {
            const response = await fetch('http://localhost:3000/save-recipe', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to save recipe');
            }

            const result = await response.json();
            alert('Recipe added successfully!');
            window.location.href = `recipe-detail.html?id=${result.recipe.id}`;
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert(`Failed to save recipe: ${error.message}`);
        }
    });
});