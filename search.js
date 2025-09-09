document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const searchBtn = document.getElementById('search-btn');
    const randomBtn = document.getElementById('random');
    const allBtn = document.getElementById('all');
    const searchInput = document.getElementById('site-search');
    const resultsDiv = document.getElementById('pokemon-cards');
    
    // Debug: Check if elements are found
    console.log("Elements found:");
    console.log("- Search button:", searchBtn);
    console.log("- Random button:", randomBtn);
    console.log("- All button:", allBtn);
    console.log("- Search input:", searchInput);
    console.log("- Results div:", resultsDiv);
    
    // Search button event
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            console.log("🔍 Search button clicked!");
            
            const query = searchInput.value.trim();
            console.log("Search query:", query);
            
            if (!query) {
                alert("Please enter a Pokemon name!");
                return;
            }
            
            // Show loading message
            resultsDiv.innerHTML = '<p>Searching...</p>';
            
            try {
                console.log(`Making request to: /api/search?q=${query}`);
                
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const results = await response.json();
                console.log("Search results:", results);
                
                displayResults(results);
                
            } catch (error) {
                console.error("❌ Search error:", error);
                resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });
    } else {
        console.error("❌ Search button not found!");
    }
    
    // Random button event
    if (randomBtn) {
        randomBtn.addEventListener('click', async () => {
            console.log("🎲 Random button clicked!");
            
            try {
                const response = await fetch('/pokemon');
                const allPokemon = await response.json();
                const randomIndex = Math.floor(Math.random() * allPokemon.length);
                const randomPokemon = allPokemon[randomIndex];
                
                displayResults([randomPokemon]);
                
            } catch (error) {
                console.error("❌ Random error:", error);
                resultsDiv.innerHTML = `<p style="color: red;">Error getting random Pokemon</p>`;
            }
        });
    }
    
    // All button event
    if (allBtn) {
        allBtn.addEventListener('click', async () => {
            console.log("📋 All button clicked!");
            
            resultsDiv.innerHTML = '<p>Loading all Pokemon...</p>';
            
            try {
                const response = await fetch('/pokemon');
                const allPokemon = await response.json();
                
                displayResults(allPokemon);
                
            } catch (error) {
                console.error("❌ All Pokemon error:", error);
                resultsDiv.innerHTML = `<p style="color: red;">Error loading Pokemon</p>`;
            }
        });
    }
    
    // Display function
    function displayResults(pokemonArray) {
        console.log(`📺 Displaying ${pokemonArray.length} Pokemon`);
        
        if (!pokemonArray || pokemonArray.length === 0) {
            resultsDiv.innerHTML = '<p>No Pokemon found!</p>';
            return;
        }
        
        const html = pokemonArray.map(pokemon => `
            <div class="pokemon-card" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px; border-radius: 8px; background: white;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${pokemon.name} (#${pokemon.id})</h3>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${pokemon.type.join(', ')}</p>
                <p style="margin: 5px 0;"><strong>Region:</strong> ${pokemon.region}</p>
            </div>
        `).join('');
        
        resultsDiv.innerHTML = html;
    }
    
    // Add Enter key functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log("⌨️ Enter key pressed!");
                searchBtn.click();
            }
        });
    }
    
    // Test connection on load
    console.log("🧪 Testing server connection...");
    fetch('/pokemon')
        .then(response => response.json())
        .then(data => {
            console.log(`✅ Server connected! ${data.length} Pokemon loaded.`);
        })
        .catch(error => {
            console.error("❌ Server connection failed:", error);
        });
});