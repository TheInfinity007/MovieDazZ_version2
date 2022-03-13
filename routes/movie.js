const express = require('express');

const router = express.Router();

const Controller = require('../controllers/movie');

// MOVIE ROUTE
router.get('/in-theatre/*', Controller.getInTheatreMovies);

router.get('/evergreen/*', Controller.getEvergreenMovies);

router.get('/upcoming/*', Controller.getUpcomingMovies);

router.get('/trending/*', Controller.getTrendingMovies);

// FOR SEARCH PAGE
router.get('/i/:imdb_id/*', Controller.searchMovieByIMDBId);

// TO GET THE DETAILS ABOUT A MOVIE FROM HOME PAGE MOVIES CATEGORIES PAGE
router.get('/:movie_id/', Controller.getMovieById);

module.exports = router;
