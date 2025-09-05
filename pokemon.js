        const express = require('express');
        const app = express();
        const pokemonData = require('./pokemon.json');
        const pokemon=pokemonData.pokemon;
        const path = require('path');
        app.use(express.static(path.join(__dirname)));

        app.get('/pokemon', (req, res, next) => {
          res.send(pokemon);
        });

        app.get('/pokemon/:id', (req, res, next) => {
          const id = parseInt(req.params.id);
          const poke = pokemon.find(p => p.id === id);
          if (poke) {
            res.send(poke);
          } else {
            res.status(404).send({error: 'Pokemon not found'});
          }
        });

        app.post('/pokemon', express.json(), (req, res, next) => {
          const newPoke = req.body;
          newPoke.id = pokemon.length ? pokemon[pokemon.length - 1].id + 1 : 1;
          pokemon.push(newPoke);
          res.status(201).send(newPoke);
        });

        app.delete('/pokemon/:id', (req, res, next) => {
          const id = parseInt(req.params.id);
          const index = pokemon.findIndex(p => p.id === id);
          if (index !== -1) {
            const deletedPoke = pokemon.splice(index, 1);
            res.send(deletedPoke[0]);
          } else {
            res.status(404).send({error: 'Pokemon not found'});
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