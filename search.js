document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');


    const searchBtn = document.getElementById('search-btn');
    const randomBtn = document.getElementById('random');
    const typeSelect = document.getElementById('type-dropdown');
    const searchInput = document.getElementById('site-search');
    const resultsDiv = document.getElementById('pokemon-cards');
    
    // Debug: Check if elements are found
    console.log("Elements found:");
    console.log("- Search button:", searchBtn);
    console.log("- Random button:", randomBtn);
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
    } 
    
    // GET Random Pokemon
    if (randomBtn) {
        randomBtn.addEventListener('click', async () => {
            console.log("Random button clicked!");

            resultsDiv.innerHTML = '<p>Loading random Pokemon...</p>';
            
            try {
                const response = await fetch('/api/random');
                const results = await response.json();
                
                displayResults([results]);

            } catch (error) {
                console.error("Random fetch error:", error);
                resultsDiv.innerHTML = '<p style="color: red;">Failed to load random Pokemon</p>';
            }   
        });
    }

    // Search by type(if dropdown exists)
    if (typeSelect) {
        typeSelect.addEventListener('change', async () => {
            const selectedType = typeSelect.value;
            if(!selectedType) return;

            console.log(`Type selected: ${selectedType}`);
            resultsDiv.innerHTML = `<p>Loading ${selectedType} type Pokemon...</p>`;
            
            try {
            
                const response= await fetch(`/api/type/${selectedType}`);
                const results=await response.json();

                displayResults(results);
                
            } catch (error) {
                console.error("Type search error:", error);
                resultsDiv.innerHTML = `<p style="color: red;"> Failed to load ${selectedType} Pokemon</p>`;
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
            <div class="pokemon-card" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px; border-radius: 8px; background: white; display: inline-block; width: 250px;">
                <div style="text-align: center;">
                    ${pokemon.sprite ? `<img src="${pokemon.sprite}" alt="${pokemon.name}" style="width: 120px; height: 120px;">` : ''}
                    <h3 style="margin: 10px 0; color:#333; text-transform: capitalize">${pokemon.name} (#${pokemon.id}) </h3>
                </div>

                <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
                <p><strong>Height:</strong> ${(pokemon.height/10).toFixed(1)}m</p>
                <p><strong>Weight:</strong> ${(pokemon.weight/10).toFixed(1)}kg</p>
                <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>

                <div style="margin-top: 10px;">
                    <strong>Stats:</strong>
                    ${pokemon.stats.map(stat => `
                        <div style="margin: 2px 0; font-size: 12px;">
                            ${stat.name}: ${stat.value}
                        </div>
                    `).join('')}
                </div>         
            </div>
        `).join('');
        
        resultsDiv.innerHTML = html;
    }
    
    // Add Enter key functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    console.log("PokeAPI Ready");
});