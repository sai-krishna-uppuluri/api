const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const database_Path = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());

let database = null;
const initializeDbServer = async () => {
  try {
    database = await open({
      filename: database_Path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:/3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbServer();

const convertMovieObjectToResponse = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieNames = `SELECT movie_name FROM movie;`;
  const MovieNames = await database.all(getMovieNames);
  response.send(MovieNames.map((each) => ({ movieName: each.movie_name })));
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const movieDetails = await database.get(getMovie);
  response.send(convertMovieObjectToResponse(movieDetails));
});
