// Function to fetch and display recipe details
let loadSingleItem = id => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
        .then(res => res.json())
        .then(item => displaySingleItem(item));
}

// Function to display recipe details in the modal
let displaySingleItem = item => {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = ''; // Clear previous content

    const meal = item.meals[0]; // Get the first meal from the response
    const div = document.createElement('div');

    div.innerHTML = `
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <h4>Ingredients</h4>
        <ul>
            ${Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] ? `<li>${meal[`strIngredient${i + 1}`]} - ${meal[`strMeasure${i + 1}`]}</li>` : '').join('')}
        </ul>
        <h4>Instructions</h4>
        <p>${meal.strInstructions}</p>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Watch on YouTube</a>
    `;

    modalBody.appendChild(div); // Append the new content to the modal body

    // Show the modal
    const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    exampleModal.show();
}


// Example function to search for meals (if needed)
document.getElementById('search-btn').addEventListener('click', function () {
    let inputField = document.getElementById('search-box');
    let mealName = inputField.value;
    let error = document.getElementById('input-error');

    if (mealName !== '') {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    displayFood(data.meals);
                    error.innerText = '';
                } else {
                    error.innerText = 'No results found. Please try another food name.';
                }
            })
            .catch(err => {
                error.innerText = 'An error occurred while fetching data.';
                console.error(err);
            });
    } else {
        error.innerText = 'Please insert food name. e.g., fish pie, chicken, etc.';
    }

    inputField.value = ''; // Clear the input field
});

// Function to display food items
let displayFood = meals => {
    let mainDiv = document.getElementById('main-container');
    mainDiv.textContent = ''; // Clear previous results

    meals.forEach(meal => {
        let div = document.createElement('div');
        div.classList.add('card-detail');
        div.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb}" class="card-img" alt="${meal.strMeal}">
                <div class="content">
                    <h3 class="card-title">${meal.strMeal}</h3>
                    <p class="card-text">${meal.strInstructions.slice(0, 150)}...</p>
                    <button onclick="loadSingleItem(${meal.idMeal})" type="button" class="button">View Recipe</button>
                </div>
            </div>
        `;
        mainDiv.appendChild(div); // Append the new card to the main container
    });
}

function readMore(categoryName, additionalInfo) {
    const modalBody = document.getElementById('category-modal-body');
    modalBody.innerHTML = `
        <h4>${categoryName}</h4>
        <p>${additionalInfo}</p>
    `;

    // Show the modal
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
    categoryModal.show();
}
 
function displayDetails (){
    let details = "This recipe includes ingredients such as flour, water, and spices. Follow these steps to prepare it...";
    let detailsDisplay = document.getElementById('recipe');
    detailsDisplay.textContent = details;
    window.open(recipeUrl, "_blank");

}

// Function to open category information in a new tab
async function openCategoryPage(category) {

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php?c=${category}`); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Assuming the API returns a URL for the category details
        const categoryUrl = data.url; // Replace with the actual key from your API response

        // Open the URL in a new tab
        window.open(categoryUrl, '_blank');
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}