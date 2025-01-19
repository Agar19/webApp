// router.js
const router = {
    init() {
        // Handle initial route
        this.handleLocation();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handleLocation.bind(this));
        
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a')) {
                this.route(e);
            }
        });
    },

    routes: {
        "": "./pages/mainPage.html",  // Root path
        "404": "./pages/404.html",
        "main": "./pages/mainPage.html",
        "profile": "./pages/profile.html",
        "recipes": "./pages/all-recipes.html",
        "add-recipe": "./pages/add-recipe.html",
        "CalorieCount": "./pages/CalorieCount.html",
        "About": "./pages/About.html",
        "recipe/:id": "./pages/recipe-detail.html"
        
    },

    route(event) {
        if (event) {
            event.preventDefault();
            const href = event.target.getAttribute('href');
            window.history.pushState({}, "", href);
        }
        this.handleLocation();
    },

    async handleLocation() {
        // Remove leading/trailing slashes and get the path
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '') || '';
        
        // Find the matching route or use 404
        const route = this.routes[path] || this.routes["404"];
        
        try {
            const response = await fetch(route);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            document.getElementById("mainPage").innerHTML = html;
        } catch (error) {
            console.error('Error loading page:', error);
            const response = await fetch(this.routes["404"]);
            const html = await response.text();
            document.getElementById("mainPage").innerHTML = html;
        }
    }
};

// Initialize the router
document.addEventListener('DOMContentLoaded', () => router.init());

// Make router available globally if needed
window.router = router;