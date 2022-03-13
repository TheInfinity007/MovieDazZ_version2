const request = require('request');

const ExternalIds = require('../models/externalId');

let start;
let recommendations = [];

const grabRecommendation = (id) => {
    recommendations = [];
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            for (let i = 0; i < 10 && i < data.results.length; i++) {
                recommendations.push(data.results[i]);
            }
        }
    });
};

const grabMovieData = (res, imdbId) => {
    if (imdbId == null) {
        console.log('IMDB ID IS NOT DEFINED FOR THIS MOVIE');
        return res.redirect('/');
    }
    const url = `http://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=thewdb`;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            if (data.Response.toLowerCase() === 'true') {
                console.log(new Date().getTime() - start);
                return res.render('show', { data, recommendations });
            }
            console.log('Data Not Found Exit 2');
            return res.redirect('back');
        }
        if (error)console.log('Error = ', error);
        if (response) { console.log('Status Code = ', response.statusCode); }
        console.log('ERROR OCCURED IN FETCHING THE DATA');
        return res.redirect('back');
    });
};

const getImdbId = (res, mId) => {
    const url = `https://api.themoviedb.org/3/movie/${mId}/external_ids?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    let validId = false;
    let imdbId;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            imdbId = data.imdb_id;
            validId = true;
            console.log(imdbId);
            ExternalIds.create({ tmdbId: mId, imdbId }, (err, obj) => {
                console.log(`New = ${obj}`);
            });
            grabMovieData(res, imdbId);
            if (validId) {
                console.log('This is a valid Id');
            }
        } else {
            if (error)console.log('Error1 = ', error);
            if (response) { console.log('Status Code1 = ', response.statusCode); }
            console.log('Unable to get the imdb id from tmdb id');
            res.redirect('back');
        }
    });
};

const getMovieById = async (req, res) => {
    console.log('[getMovieById]');
    start = new Date().getTime();
    const movieId = req.params.movie_id.substr(0, req.params.movie_id.indexOf('-')) || req.params.movie_id;
    console.log(movieId);
    grabRecommendation(movieId);
    let imdbId;
    try {
        const foundContent = await ExternalIds.findOne({ tmdbId: movieId }, { imdbId: 1 });
        imdbId = foundContent.imdbId;
        console.log('Found = ', foundContent);
    } catch (err) {
        // silent
    }
    console.log(`IMDBID = ${imdbId}`);
    if (imdbId === undefined) {
        getImdbId(res, movieId);
    } else {
        grabMovieData(res, imdbId);
    }
    console.log(movieId);
};

const searchMovieByIMDBId = async (req, res) => {
    try {
        const foundContent = await ExternalIds.findOne({ imdbId: req.params.imdb_id });
        const { tmdbId } = foundContent;
        console.log('Found = ', foundContent);
        if (tmdbId) {
            console.log('Finding the recommendations');
            grabRecommendation(tmdbId);
        }
    } catch (err) {
        // silent
    }
    grabMovieData(res, req.params.imdb_id);
};

// FOR MOVIE CATEGORY
const getMovies = (res, url, pageTitle, pageUrl, pageNo) => {
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const movies = [];
            data.results.forEach((result) => {
                if (result.poster_path === null) return;
                const temp = [];
                temp.push(result.id);
                temp.push(result.vote_average);
                temp.push(result.title);
                temp.push(result.release_date);
                temp.push(result.poster_path);
                movies.push(temp);
            });
            console.log(new Date().getTime() - start);
            res.render('movie', {
                data: movies,
                pageTitle,
                pageUrl,
                current: pageNo,
                pages: data.total_pages,
            });
        } else {
            if (error)console.log('Error = ', error);
            if (response) { console.log('Status Code = ', response.statusCode); }
            console.log('ERROR OCCURED IN FETCHING THE DATA');
            res.redirect('back');
        }
    });
};

const getTrendingMovies = async (req, res) => {
    start = new Date().getTime();
    let pageNo = 1;
    if (req.query.page) {
        pageNo = parseInt(req.query.page, 10);
    }
    const url = `https://api.themoviedb.org/3/trending/movie/day?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    const pageTitle = 'Trending';
    const pageUrl = 'trending';
    getMovies(res, url, pageTitle, pageUrl, pageNo);
};

const getUpcomingMovies = (req, res) => {
    start = new Date().getTime();
    let pageNo = 1;
    if (req.query.page) {
        pageNo = parseInt(req.query.page, 10);
    }
    const url = `https://api.themoviedb.org/3/movie/upcoming?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    const pageTitle = 'Upcoming';
    const pageUrl = 'upcoming';
    getMovies(res, url, pageTitle, pageUrl, pageNo);
};

const getEvergreenMovies = (req, res) => {
    start = new Date().getTime();
    let pageNo = 1;
    if (req.query.page) {
        pageNo = parseInt(req.query.page, 10);
    }
    const url = `https://api.themoviedb.org/3/movie/top_rated?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    const pageTitle = 'Evergreen';
    const pageUrl = 'evergreen';
    getMovies(res, url, pageTitle, pageUrl, pageNo);
};

const getInTheatreMovies = (req, res) => {
    start = new Date().getTime();
    let pageNo = 1;
    if (req.query.page) {
        pageNo = parseInt(req.query.page, 10);
    }
    const url = `https://api.themoviedb.org/3/movie/now_playing?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    const pageTitle = 'In Theatre';
    const pageUrl = 'in-theatre';
    getMovies(res, url, pageTitle, pageUrl, pageNo);
};

const getPopularMovies = (req, res) => {
    start = new Date().getTime();
    let pageNo = 1;
    if (req.query.page) {
        pageNo = parseInt(req.query.page, 10);
    }
    const url = `https://api.themoviedb.org/3/movie/popular?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
    const pageTitle = 'Popular';
    const pageUrl = '';
    getMovies(res, url, pageTitle, pageUrl, pageNo);
};

module.exports = {
    grabRecommendation,
    grabMovieData,
    getImdbId,
    getMovieById,
    searchMovieByIMDBId,
    getMovies,
    getTrendingMovies,
    getUpcomingMovies,
    getEvergreenMovies,
    getInTheatreMovies,
    getPopularMovies,
};
