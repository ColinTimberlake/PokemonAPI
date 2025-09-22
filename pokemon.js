        const express = require('express');
        const app = express();
        const path = require('path');

        app.use(express.static(path.join(__dirname)));
        app.use(express.json());

        async function fetchFromPokeAPI(url) {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();          
          } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;  
          }
        }
        
        async function getPokemonDetails(url) {
          const data= await fetchFromPokeAPI(url);

          return {
            id: data.id,
            name: data.name,
            types: data.types.map(type => type.type.name),
            sprite: data.sprites.front_default,
            height: data.height, 
            weight: data.weight,
            abilities: data.abilities.map(ability => ability.ability.name),
            stats: data.stats.map(stat => ({
              name: stat.stat.name,
              value: stat.base_stat
            }))
          };
        }

        // Search Pokemon by name or ID
        app.get('/api/pokemon/:nameOrId', async (req, res) => {
          try {
            const{ nameOrId } = req.params;
            console.log(`Fetching Pokemon: ${nameOrId}`);

            const pokemonData = await fetchFromPokeAPI(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);

            const pokemon = {
              id: pokemonData.id,
              name: pokemonData.name,
              types: pokemonData.types.map(type => type.type.name),
              sprite: pokemonData.sprites.front_default,
              height: pokemonData.height,
              weight: pokemonData.weight,
              abilities: pokemonData.abilities.map(ability => ability.ability.name),
              stats: pokemonData.stats.map(stat => ({
                name: stat.stat.name,
                value:stat.base_stat
              }))
            };
            res.json(pokemon);
          } catch (error) {
            console.error('Error fetching Pokemon:', error);
            res.status(404).json({ error: 'Pokemon not found' });
          }
        });


        // SEARCH pokemon by name, type, or region
        app.get('/api/search', async (req, res) => {
          try {
            const query = req.query.q?.toLowerCase() || '';
            console.log(`Searching for: ${query}`);
    
            if (!query) {
              return res.json([]);
            }

            const speciesData = await fetchFromPokeAPI('https://pokeapi.co/api/v2/pokemon-species?limit=1000');

            const matchingSpecies = speciesData.results.filter(pokemon =>
              pokemon.name.includes(query)
            ).slice(0,20); //limits to 20 results for performance

            const pokemonPromises = matchingSpecies.map(async (species) => {
              try {
                return await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
              } catch (error) {
                console.error(`Error fetching ${species.name}:`, error);
                return null;
              }
            });

            const pokemonResults = await Promise.all(pokemonPromises);
            const validResults = pokemonResults.filter(pokemon => pokemon !== null);
            
            console.log(`Found ${validResults.length} Pokemon matching "${query}"`);
            res.json(validResults);
            
          } catch (error) {
            console.error('Search error: ', error);
            res.status(500).json({ error: 'Search failed' });
          }                                                   
        });

        // GET random pokemon
        app.get('/api/random', async (req, res) => {
          try {
            const randomId = Math.floor(Math.random() * 1010) +1;
            console.log(`Getting random Pokemon with ID: ${randomId}`);

            const pokemon = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            res.json(pokemon);
          } catch (error) {
            console.error('Random Pokemon error:', error);
            res.status(500).json({ error: 'Failed to get random Pokemon' });
          }
        });

        app.get('/api/type/:typeName',  async(req, res) => {
          try {
            const { typeName } = req.params;
            console.log(`Fetching Pokemon of type: ${typeName}`);

            const typeData = await fetchFromPokeAPI(`https://pokeapi.co/api/v2/type/${typeName.toLowerCase()}`);
            
            const pokemonOfType = typeData.pokemon.slice(0, 20); 

            const pokemonPromises = pokemonOfType.map(async (entry) => {
              try {
                return await getPokemonDetails(entry.pokemon.url);
              } catch (error) {
                console.error('Error fetching Pokemon: ', error);
                return null;
              }
            });

            const pokemonResults = await Promise.all(pokemonPromises);
            const validResults = pokemonResults.filter(pokemon => pokemon !== null);  

            res.json(validResults);
          } catch (error) {
            console.error('Type search error:', error);
            res.status(404).json({ error: `Type '${req.params.typeName}' not found` });
          }
        });


        module.exports = {app};