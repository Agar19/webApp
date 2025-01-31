document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = searchForm.querySelector('input[type="search"]');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'search-results';
    searchResultsContainer.style.position = 'absolute';
    searchResultsContainer.style.top = '100%';
    searchResultsContainer.style.zIndex = '1000';
    searchResultsContainer.style.backgroundColor = 'white';
    searchResultsContainer.style.border = '1px solid #ddd';
    searchResultsContainer.style.maxHeight = '300px';
    searchResultsContainer.style.overflowY = 'auto';
    searchResultsContainer.style.display = 'none';
    searchResultsContainer.style.borderRadius = '5px';
    
    // search container search hesgiin door garch ireh bairlal
    searchForm.style.position = 'relative';
    searchForm.appendChild(searchResultsContainer);

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await performSearch();
    });

    searchInput.addEventListener('input', async () => {
        if (searchInput.value.trim().length > 1) {
            await performSearch();
        } else {
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        
        if (query.length < 2) return;

        try {
            const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Search request failed');
            }
            
            const results = await response.json();
            displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            searchResultsContainer.innerHTML = '<div style="padding: 10px;">Error performing search</div>';
            searchResultsContainer.style.display = 'block';
        }
    }

    function displaySearchResults(results) {
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<div style="padding: 10px;">No recipes found</div>';
            searchResultsContainer.style.display = 'block';
            return;
        }

        results.forEach(recipe => {
            const resultItem = document.createElement('div');
            resultItem.style.padding = '10px';
            resultItem.style.borderBottom = '1px solid #eee';
            resultItem.style.cursor = 'pointer';
            
            resultItem.innerHTML = `
                <strong>${recipe.name}</strong>
                <p>${recipe.description.substring(0, 50)}...</p>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = `/pages/recipe-detail?id=${recipe.id}`;
            });

            resultItem.addEventListener('mouseover', () => {
                resultItem.style.backgroundColor = '#f0f0f0';
            });

            resultItem.addEventListener('mouseout', () => {
                resultItem.style.backgroundColor = 'white';
            });

            searchResultsContainer.appendChild(resultItem);
        });

        searchResultsContainer.style.display = 'block';
    }

    // search bar aas gadna darval search iig haana
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
});