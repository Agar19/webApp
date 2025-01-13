const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    
    // Extract just the pathname from the href
    const href = event.target.getAttribute('href');
    window.history.pushState({}, "", href);
    handleLocation();
};

const routes = {
    "404": "./pages/404.html",
    "main": "./pages/mainPage.html",
    "profile": "./pages/profile.html",
    "recipes": "./pages/all-recipes.html",
    "add-recipe": "./pages/add-recipe.html",  // Matches your file structure
    "CalorieCount": "./pages/CalorieCount.html",  // Matches case in your file structure
    "About": "./pages/About.html"  // Matches case in your file structure
};

const handleLocation = async () => {
    const path = window.location.pathname.replace(/^\/+/, ''); // Remove leading slashes
    const route = routes[path] || routes["404"];
    
    try {
        const html = await fetch(route).then((data) => data.text());
        document.getElementById("mainPage").innerHTML = html;
    } catch (error) {
        console.error('Error loading page:', error);
        const is404 = await fetch(routes["404"]).then((data) => data.text());
        document.getElementById("mainPage").innerHTML = is404;
    }
};

// Initialize
window.route = route;
window.onpopstate = handleLocation;
window.route = route;

// Initial load
handleLocation();