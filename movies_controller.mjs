import 'dotenv/config';
import * as movies from './movies_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());


/**
 * Create a new movie with the title, year and language provided in the body
 */
app.post('/movies', (req, res) => {
    movies.createMovie(req.body.title, req.body.year, req.body.language)
        .then(movie => {
            res.status(201).json(movie);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Request failed' });
        });
});


/**
 * Retrive the movie corresponding to the ID provided in the URL.
 */
app.get('/movies/:_id', (req, res) => {
    const movieId = req.params._id;
    movies.findMovieByID(movieId)
        .then(movie => { 
            if (movie !== null) {
                res.json(movie);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Retrieve movies. 
 * If the query parameters include a year, then only the movies for that year are returned.
 * Otherwise, all movies are returned.
 */
app.get('/movies', (req, res) => {
    let filter = {};
    const properties = ["title", "year", "language"];
    for (let prop of properties){
        if (req.query[prop] !== undefined){
            filter[prop] = req.query[prop];
        }
    }
    movies.findMovies(filter)
        .then(movies => {
            res.send(movies);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});
/**
 * Update the movie whose id is provided in the path parameter and set
 * its title, year and language to the values provided in the body.
 */
app.put('/movies/:_id', (req, res) => {
    movies.replaceMovie(req.params._id, req.body.title, req.body.year, req.body.language)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, title: req.body.title, year: req.body.year, language: req.body.language })
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Delete the movie whose id is provided in the query parameters
 */
app.delete('/movies/:_id', (req, res) => {
    movies.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});