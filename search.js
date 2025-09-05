document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('button');
    const searchInput = document.getElementById('site-search');
    const resultsDiv = document.getElementById('pokemon-cards');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        // Fetch all pokemon from your API
        const response = await fetch('/pokemon');
        const pokemonList = await response.json();

        // Find matching pokemon by name (case-insensitive)
        const found = pokemonList.find(p => p.name.toLowerCase() === query);

        // Display result
        resultsDiv.innerHTML = '';
        if (found) {
            resultsDiv.innerHTML = `
                <div class="pokemon-card">
                    <h3>${found.name}</h3>
                    <p>Type: ${found.type.join(', ')}</p>
                    <p>Region: ${found.region}</p>
                </div>
            `;
        } else {
            resultsDiv.textContent = 'No Pokémon found!';
        }
    });
});