const ingredientsDatabase = [

    { name: 'Chicken Breast', calories: 165 },
    { name: 'Salmon', calories: 208 },
    { name: 'Tuna (Canned)', calories: 128 },
    { name: 'Beef', calories: 250 },
    { name: 'Mutton', calories: 270 },
    { name: 'Pork', calories: 242 },
    { name: 'Tofu', calories: 144 },
    { name: 'Egg', calories: 78 },
    { name: 'Brown Rice', calories: 111 },
    { name: 'White Rice', calories: 130 },
    { name: 'Oats', calories: 389 },
    { name: 'Whole Wheat Bread', calories: 247 },
    { name: 'White Bread', calories: 266 },
    { name: 'Pasta (Cooked)', calories: 131 },
    { name: 'Sweet Potato', calories: 86 },
    { name: 'Potato', calories: 77 },
    { name: 'Broccoli', calories: 55 },
    { name: 'Spinach', calories: 23 },
    { name: 'Carrots', calories: 41 },
    { name: 'Cucumber', calories: 16 },
    { name: 'Tomato', calories: 18 },
    { name: 'Lettuce', calories: 15 },

    { name: 'Apple', calories: 95 },
    { name: 'Banana', calories: 105 },
    { name: 'Orange', calories: 62 },
    { name: 'Strawberries', calories: 32 },
    { name: 'Blueberries', calories: 57 },
    { name: 'Avocado', calories: 320 },
    { name: 'Watermelon', calories: 30 },
    { name: 'Grapes', calories: 69 },
    { name: 'Mango', calories: 60 },

    { name: 'Almonds', calories: 579 },
    { name: 'Walnuts', calories: 654 },
    { name: 'Peanuts', calories: 567 },


    { name: 'Milk', calories: 61 },
    { name: 'Cheese', calories: 402 },

    { name: 'Olive Oil', calories: 119 },
    { name: 'Butter', calories: 717 },
    { name: 'Mayonnaise', calories: 680 },

    { name: 'Popcorn', calories: 31 },
    { name: 'Dark Chocolate', calories: 546 },
    { name: 'Honey', calories: 304 }
];

const ingredientInput = document.getElementById('ingredient-input');
const ingredientSuggestions = document.getElementById('ingredient-suggestions');
const selectedIngredient = document.getElementById('selected-ingredient');
const ingredientAmount = document.getElementById('ingredient-amount');
const addIngredientBtn = document.getElementById('add-ingredient');
const ingredientsList = document.getElementById('ingredients-list');
const totalCaloriesSpan = document.getElementById('total-calories');
const resetMealBtn = document.getElementById('reset-meal');

// dropdown for ingredient
function populateIngredientDropdown() {
    ingredientsDatabase.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.name;
        option.textContent = ingredient.name;
        selectedIngredient.appendChild(option);
    });
}

// Show ingredient suggestions
ingredientInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    ingredientSuggestions.innerHTML = '';

    if (searchTerm.length > 1) {
        const filteredIngredients = ingredientsDatabase.filter(ingredient => 
            ingredient.name.toLowerCase().includes(searchTerm)
        );

        filteredIngredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient.name;
            li.addEventListener('click', () => {
                selectedIngredient.value = ingredient.name;
                ingredientInput.value = '';
                ingredientSuggestions.innerHTML = '';
            });
            ingredientSuggestions.appendChild(li);
        });
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', function(event) {
    if (!ingredientSuggestions.contains(event.target) && event.target !== ingredientInput) {
        ingredientSuggestions.innerHTML = '';
    }
});

// Add ingredient to meal
addIngredientBtn.addEventListener('click', function() {
    const ingredientName = selectedIngredient.value;
    const amount = parseFloat(ingredientAmount.value);

    // Validate input
    if (!ingredientName || isNaN(amount) || amount <= 0) {
        alert('Please select an ingredient and enter a valid amount.');
        return;
    }

    // Find ingredient in database
    const ingredient = ingredientsDatabase.find(ing => ing.name === ingredientName);
    
    if (!ingredient) {
        alert('Ingredient not found.');
        return;
    }

    // Calculate calories (per 100g)
    const caloriesPer100g = ingredient.calories;
    const calculatedCalories = (amount / 100) * caloriesPer100g;

    // Create table row
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${ingredientName}</td>
        <td>${amount} g</td>
        <td>${calculatedCalories.toFixed(1)} kcal</td>
        <td><button class="delete-btn" data-calories="${calculatedCalories}">Delete</button></td>
    `;

    // Add delete functionality
    const deleteBtn = tr.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        const caloriesRemoved = parseFloat(this.dataset.calories);
        tr.remove();
        updateTotalCalories(-caloriesRemoved);
    });

    // Add row to table and update total calories
    ingredientsList.appendChild(tr);
    updateTotalCalories(calculatedCalories);

    // Reset inputs
    selectedIngredient.selectedIndex = 0;
    ingredientAmount.value = '';
});

// Update total calories
function updateTotalCalories(calories) {
    const currentTotal = parseFloat(totalCaloriesSpan.textContent);
    const newTotal = currentTotal + calories;
    totalCaloriesSpan.textContent = newTotal.toFixed(1);
}

// Reset meal
resetMealBtn.addEventListener('click', function() {
    ingredientsList.innerHTML = '';
    totalCaloriesSpan.textContent = '0';
});

// Initialize dropdown on page load
populateIngredientDropdown();