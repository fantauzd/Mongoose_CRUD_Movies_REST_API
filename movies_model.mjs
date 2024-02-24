import mongoose from 'mongoose';
import 'dotenv/config';

console.log(process.env.MONGODB_CONNECT_STRING);

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    language: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Movie = mongoose.model("Movie", movieSchema);

/** 
 * Create a movie
 * @param {String} title
 * @param {Number} year
 * @param {String} language
 * @returns A promise. Resolves to JavaScript object for the document created
 *          by calling save.
*/
const createMovie = async (title, year, language) => {
    const movie = new Movie({title: title, year: year, language: language});
    return movie.save();
}

/**
 * Find a movie in our database based on an id
 * @param {String} _id
 * @returns {Object} The MongoDB results from the query
 */
const findMovieByID = async (_id) => {
    const query = Movie.findById(_id);
    return query.exec();
}

/**
 * Find movie(s) in our database based on a filter parameter
 * @param {Object} filter
 * @returns {Object} The MongoDB results from the query
 */
const findMovies = async (filter) => {
    const query = Movie.find(filter);
    return query.exec();
}

/**
 * Replace a movie in our database. Receives the id of the movie to be updated
 * and an object with the parameters that should be replaced, and the new values
 * @param {Object} filter
 * @param {object} update
 * @returns {Number} 1 if updated and 0 if not found
 */
const replaceMovie = async(id, newTitle, newYear, newLanguage) => {
    const result = await Movie.replaceOne({_id: id}, {title: newTitle, year: newYear, language: newLanguage});
    return result.modifiedCount;
}

const deleteById = async (id) => {
    const result = await Movie.deleteOne({_id: id});
    return result.deletedCount;
}

export {createMovie, findMovies, findMovieByID, replaceMovie, deleteById};