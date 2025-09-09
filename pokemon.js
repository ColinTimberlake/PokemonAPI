        const express = require('express');
        const fs = require('fs');
        const app = express();
        const pokemonData = require('./pokemon.json');
        const pokemon=pokemonData.pokemon;
        const path = require('path');

        app.use(express.static(path.join(__dirname)));
        app.use(express.json());

        app.get('/pokemon', (req, res, next) => {
          res.json(pokemon);
        });

        // SEARCH pokemon by name, type, or region
        app.get('/api/search', (req, res) => {
          const query = req.query.q?.toLowerCase() || '';
    
          if (!query) {
            return res.json([]);
          }
    
          const results = pokemon.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.type.some(type => type.toLowerCase().includes(query)) ||
            p.region.toLowerCase().includes(query)
          );
    
          res.json(results);
        });

        // GET random pokemon
        app.get('/api/random', (req, res) => {
          const randomIndex = Math.floor(Math.random() * pokemon.length);
          res.json(pokemon[randomIndex]);
        });

        app.get('/pokemon/:id', (req, res, next) => {
          const id = parseInt(req.params.id);
          const poke = pokemon.find(p => p.id === id);
          if (poke) {
            res.json(poke);
          } else {
            res.status(404).json({error: 'Pokemon not found'});
          }
        });

        app.post('/pokemon', express.json(), (req, res, next) => {
          const newPoke = req.body;
          newPoke.id = pokemon.length ? Math.max(...pokemon.map(p=>p.id)) + 1 : 1;
          pokemon.push(newPoke);
          res.status(201).json(newPoke);
        });

        app.delete('/pokemon/:id', (req, res, next) => {
          const id = parseInt(req.params.id);
          const index = pokemon.findIndex(p => p.id === id);
          if (index !== -1) {
            const deletedPoke = pokemon.splice(index, 1);
            res.json(deletedPoke[0]);
          } else {
            res.status(404).json({error: 'Pokemon not found'});
          }  
        }); 

        app.put('/pokemon/:id', express.json(), (req, res, next) => {
          const id = parseInt(req.params.id);
          const index = pokemon.findIndex(p => p.id === id);
          if (index !== -1) {
            const updatedPoke = {...pokemon[index], ...req.body, id: id};
            pokemon[index] = updatedPoke;
            res.send(updatedPoke);
          } else {
            res.status(404).send({error: 'Pokemon not found'});
          }   
        }); 


        module.exports = {app};