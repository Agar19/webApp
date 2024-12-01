// Calorie data for ingredients (per 100 grams)
const calorieData = {
    apple: 52,         // 52 calories per 100g
    banana: 89,        // 89 calories per 100g
    bread: 265,        // 265 calories per 100g
    chicken: 165       // 165 calories per 100g
};

function calculateCalories() {
    const ingredient = document.getElementById('ingredient').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const historyContainer = document.getElementById('history');

    if (ingredient && amount > 0) {
        // Get the calories per 100 grams for the selected ingredient
        const caloriesPer100g = calorieData[ingredient];
        // Calculate the total calories for the given amount
        const totalCalories = (caloriesPer100g * amount) / 100;

        // Display the result
        document.getElementById('result').innerText = 
            `Total Calories: ${totalCalories.toFixed(2)} kcal`;

        // Save to history
        const newEntry = document.createElement('div');
        newEntry.classList.add('history-entry');
        newEntry.innerText = `${amount} grams of ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: ${totalCalories.toFixed(2)} kcal`;
        historyContainer.appendChild(newEntry);

    } else {
        document.getElementById('result').innerText = 
            'Please select an ingredient and enter a valid amount.';
    }
}