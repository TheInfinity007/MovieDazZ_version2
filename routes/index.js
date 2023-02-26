const express = require('express');

const router = express.Router();
const request = require('request');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const Movie = require('../models/movie');
const ExternalIds = require('../models/externalId');
const Config = require('../lib/config');
const { OMDB_BASE_URI, TMDB_BASE_URI } = require('../lib/constants');

let start;
let trendingMovies = [];
let theatreMovies = [];
let upcomingMovies = [];
let popularMovies = [];
let recommendations = [];
let isRender = false;

const checkMovies = (res) => {
    if (isRender === false) {
        if (trendingMovies.length > 0 && theatreMovies.length > 0 && upcomingMovies.length > 0 && popularMovies.length > 0) {
            console.log(new Date().getTime() - start);
            isRender = true;
            res.render('index', {
                trendingMovies, theatreMovies, upcomingMovies, popularMovies,
            });
        }
    }
};

const grabTrendingMovies = (res) => {
    if (trendingMovies.length < 1) {
        const url = `${TMDB_BASE_URI}/3/trending/movie/day?api_key=${Config.movieApiKey}`;
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const data = JSON.parse(body);
                data.results.forEach((result) => {
                    if (result.poster_path === null) return;
                    const temp = [];
                    temp.push(result.id);
                    temp.push(result.vote_average);
                    temp.push(result.title);
                    temp.push(result.release_date);
                    temp.push(result.poster_path);
                    trendingMovies.push(temp);
                });
                console.log('Grab1');
                checkMovies(res);
            } else {
                console.log('Exit 1');
                grabTrendingMovies(res);
            }
        });
    }
};

const grabTheatreMovies = (res) => {
    if (theatreMovies.length < 1) {
        const url = `${TMDB_BASE_URI}/3/movie/now_playing?api_key=${Config.movieApiKey}`;
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const data = JSON.parse(body);
                data.results.forEach((result) => {
                    if (result.poster_path === null) return;
                    const temp = [];
                    temp.push(result.id);
                    temp.push(result.vote_average);
                    temp.push(result.title);
                    temp.push(result.release_date);
                    temp.push(result.poster_path);
                    theatreMovies.push(temp);
                });
                console.log('Grab2');
                checkMovies(res);
            } else {
                console.log('Exit 2');
                grabTheatreMovies(res);
            }
        });
    }
};

const grabUpcomingMovies = (res) => {
    if (upcomingMovies.length < 1) {
        const url = `${TMDB_BASE_URI}/3/movie/upcoming?api_key=${Config.movieApiKey}`;
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const data = JSON.parse(body);
                data.results.forEach((result) => {
                    if (result.poster_path === null) return;
                    const temp = [];
                    temp.push(result.id);
                    temp.push(result.vote_average);
                    temp.push(result.title);
                    temp.push(result.release_date);
                    temp.push(result.poster_path);
                    upcomingMovies.push(temp);
                });
                console.log('Grab3');
                checkMovies(res);
            } else {
                console.log('Exit 3');
                grabUpcomingMovies(res);
            }
        });
    }
};

const grabPopularMovies = (res) => {
    if (popularMovies.length < 1) {
        const url = `${TMDB_BASE_URI}/3/movie/popular?api_key=${Config.movieApiKey}`;
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const data = JSON.parse(body);
                data.results.forEach((result) => {
                    if (result.poster_path === null) return;
                    const temp = [];
                    temp.push(result.id);
                    temp.push(result.vote_average);
                    temp.push(result.title);
                    temp.push(result.release_date);
                    temp.push(result.poster_path);
                    popularMovies.push(temp);
                });
                console.log('Grab4');
                checkMovies(res);
            } else {
                console.log('Exit 4');
                grabUpcomingMovies(res);
            }
        });
    }
};

router.get('/search/:type/:title/:pageNo/*', (req, res) => {
    let url;
    if (req.query.year) {
        url = `${OMDB_BASE_URI}/?s=${req.params.title}&page=${req.params.pageNo}&type=movie&y=${req.query.year}&apikey=${Config.searchApiKey}`;
    } else {
        url = `${OMDB_BASE_URI}/?s=${req.params.title}&page=${req.params.pageNo}&type=movie&apikey=${Config.searchApiKey}`;
    }
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            if (data.Response.toLowerCase() === 'true') {
                res.render('result', {
                    data,
                    search: req.params.title,
                    current: req.params.pageNo,
                    pages: Math.ceil(data.totalResults / 10),
                    error: null,
                });
            } else {
                res.render('result', {
                    data: null,
                    search: req.params.title,
                    current: req.params.pageNo,
                    pages: null,
                    error: data.Error,
                });
            }
        } else {
            res.render('result', {
                data: null,
                search: req.params.title,
                current: req.params.pageNo,
                pages: null,
                error: 'Network Busy',
            });
        }
    });
});

// Signup Route
router.get('/register/*', (req, res) => {
    res.render('register');
});

// Handle Signup Logic
router.post('/register', (req, res) => {
    console.log(req.body);
    const { password } = req.body;
    const newUser = new User({
        username: req.body.username,
    });
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log(user);
            passport.authenticate('local')(req, res, () => {
                console.log('User has been Created');
                res.redirect('/');
            });
        }
    });
});

// Login Route
router.get('/login/*', (req, res) => {
    res.render('login');
});

// Handle Login Logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
// eslint-disable-next-line no-unused-vars
}), (req, res) => {
    console.log('Loggin the user');
});

// Logout Route
router.get('/logout/*', (req, res) => {
    req.logout();
    console.log('Logout the User');
    res.redirect('/');
});

const isNumber = (num) => {
    if (!parseInt(num, 10)) {
        return false;
    }
    return true;
};

const addToFavouriteMovie = (id, title, img, rel) => {
    const newMovie = new Movie({
        imdbId: id,
        title,
        imgUrl: img,
        release: rel,
    });

    // eslint-disable-next-line no-unused-vars
    Movie.create(newMovie, (err, movie) => {
        if (err) {
            console.log(err);
            console.log('Movie already Exist.');
        } else {
            console.log('Add a New Movie');
        }
    });
};

const getImdb = (req, id, title, img, rel) => {
    const url = `${TMDB_BASE_URI}/3/movie/${id}/external_ids?api_key=${Config.movieApiKey}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const imdbId = data.imdb_id;
            addToFavouriteMovie(imdbId, title, img, rel);
            ExternalIds.create({ tmdbId: id, imdbId }, (err, obj) => {
                console.log(`New = ${obj}`);
            });
            User.findById(req.user._id, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    user.favouriteMovieList.push(imdbId);
                    user.save();
                }
            });
        }
    });
};

const getTmdb = (req, id) => {
    const url = `${TMDB_BASE_URI}/3/find/${id}?api_key=${Config.movieApiKey}&external_source=imdb_id`;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);

            if (data.movie_results.length > 0) {
                const tmdbId = data.movie_results[0].id;
                console.log('TMDB ID IS ', tmdbId);

                User.findById(req.user._id, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        user.favouriteMovieList.push(tmdbId);
                        user.save();
                    }
                });
            }
        }
    });
};

router.get('/favourite/*', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        const myFav = user.favouriteMovieList.filter((id) => id[0] === 't');
        const movies = [];
        if (myFav.length === 0) { res.render('favourite', { movies: null, pageTitle: 'Favourites' }); }
        myFav.forEach((mId, i) => {
            Movie.findOne({ imdbId: mId }, (_err, movie) => {
                movies.push(movie);
                if (i === myFav.length - 1) {
                    res.render('favourite', { movies, pageTitle: 'Favourites' });
                }
            });
        });
    });
});

//  NEW ROUTE FOR FAVOURITE
router.post('/favourite', middleware.isLoggedIn, (req, res) => {
    const imdbId = req.body.id;
    const { title } = req.body;
    const { release } = req.body;
    const { img } = req.body;

    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log('Error Occured in Adding the items to favourites');
            console.log(err);
            return res.redirect('/');
        }
        const newMovie = user.favouriteMovieList.every((movieId) => movieId !== imdbId);
        console.log(newMovie);
        if (newMovie) {
            if (isNumber(imdbId)) { // if the id is the tmdb id
                getImdb(req, imdbId, title, img, release);
            } else {
                getTmdb(req, imdbId);
                addToFavouriteMovie(imdbId, title, img, release);
            }

            if (imdbId != null) user.favouriteMovieList.push(imdbId);
            user.save();
            console.log('Added item to favourites');
        } else {
            console.log('Movie already Exist in favourites');
        }
        return res.redirect('back');
    });
});

//  DELETE ROUTE FOR FAVOURITES
router.delete('/favourite/:imdbId', middleware.isLoggedIn, (req, res) => {
    const id = req.params.imdbId;
    let tmdbid;
    let imdbid;
    User.findById(req.user._id, async (err, user) => {
        if (err) {
            console.log('Error occurred in fetching the user');
            res.redirect('/');
        } else {
            if (isNumber(id)) { // if the id is the tmdb id
                try {
                    tmdbid = id;
                    const foundContent = await ExternalIds.findOne({ tmdbId: id });
                    imdbid = foundContent.imdbId;
                } catch (_err) {
                    // silent
                }
            } else { // if id is imdb id
                try {
                    imdbid = id;
                    const foundContent = await ExternalIds.findOne({ imdbId: id });
                    tmdbid = foundContent.tmdbId;
                } catch (_err) {
                    // silent
                }
            }
            console.log(imdbid, tmdbid);
            let i = -1; let
                t = -1;
            user.favouriteMovieList.forEach((id, index) => {
                if (id === tmdbid) { t = index; }
                if (id === imdbid) { i = index; }
            });
            if (i > t) {
                if (i !== -1) user.favouriteMovieList.splice(i, 1);
                if (t !== -1) user.favouriteMovieList.splice(t, 1);
            } else {
                if (t !== -1) user.favouriteMovieList.splice(t, 1);
                if (i !== -1) user.favouriteMovieList.splice(i, 1);
            }
            console.log('Movie removed from favourites');
            user.save();
            res.redirect('back');
        }
    });
});

const getImdbWatchList = (req, id, title, img, rel) => {
    const url = `${TMDB_BASE_URI}/3/movie/${id}/external_ids?api_key=${Config.movieApiKey}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const imdbId = data.imdb_id;
            addToFavouriteMovie(imdbId, title, img, rel);
            User.findById(req.user._id, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    user.watchList.push(imdbId);
                    user.save();
                }
            });
        }
    });
};

const getTmdbWatchList = (req, id) => {
    const url = `${TMDB_BASE_URI}/3/find/${id}?api_key=${Config.movieApiKey}&external_source=imdb_id`;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);

            if (data.movie_results.length > 0) {
                const tmdbId = data.movie_results[0].id;
                console.log('TMDB ID IS ', tmdbId);

                ExternalIds.create({ tmdbId, imdbId: id }, (err, obj) => {
                    console.log(`New = ${obj}`);
                });
                User.findById(req.user._id, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        user.watchList.push(tmdbId);
                        user.save();
                    }
                });
            }
        }
    });
};

router.get('/watchlist/*', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        const myList = user.watchList.filter((id) => id[0] === 't');
        const movies = [];
        if (myList.length === 0) { res.render('favourite', { movies: null, pageTitle: 'Watchlist' }); }
        myList.forEach((mId, i) => {
            Movie.findOne({ imdbId: mId }, (_err, movie) => {
                movies.push(movie);
                if (i === myList.length - 1) {
                    res.render('favourite', { movies, pageTitle: 'Watchlist' });
                }
            });
        });
    });
});

//  NEW ROUTE FOR WATCHLIST
router.post('/watchlist', middleware.isLoggedIn, (req, res) => {
    const imdbId = req.body.id;
    const { title } = req.body;
    const { release } = req.body;
    const { img } = req.body;

    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log('Error Occured in Adding the items to watchlist');
            console.log(err);
            return res.redirect('/');
        }
        const newMovie = user.watchList.every((movieId) => movieId !== imdbId);
        console.log(newMovie);
        if (newMovie) {
            if (isNumber(imdbId)) { // if the id is the tmdb id
                getImdbWatchList(req, imdbId, title, img, release);
            } else {
                getTmdbWatchList(req, imdbId);
                addToFavouriteMovie(imdbId, title, img, release);
            }

            if (imdbId != null) user.watchList.push(imdbId);
            user.save();
            console.log('Added item to watchlist');
        } else {
            console.log('Movie already Exist in watchlist');
        }
        return true;
    });
    return res.redirect('back');
});

//  DELETE ROUTE FOR WATCHLIST
router.delete('/watchlist/:imdbId', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, async (err, user) => {
        if (err) {
            console.log('Error occurred in fetching the user');
            res.redirect('/');
        } else {
            let tmdbid;
            const imdbid = req.params.imdbId;
            try {
                const foundContent = await ExternalIds.findOne({ imdbId: req.params.imdbId });
                tmdbid = foundContent.tmdbId;
            } catch (_err) {
                // silent
            }
            let i = -1; let
                t = -1;
            user.watchList.forEach((id, index) => {
                if (id === tmdbid) { t = index; }
                if (id === imdbid) { i = index; }
            });

            if (i > t) { // higher index movie id should be removed first
                if (i !== -1) user.watchList.splice(i, 1);
                if (t !== -1) user.watchList.splice(t, 1);
            } else {
                if (t !== -1) user.watchList.splice(t, 1);
                if (i !== -1) user.watchList.splice(i, 1);
            }
            console.log('Movie removed from watchlist');
            user.save();
            res.redirect('back');
        }
    });
});

const grabRecommendationAndRender = (res, id, img, torrents, title) => {
    recommendations = [];
    const url = `${TMDB_BASE_URI}/3/movie/${id}/recommendations?api_key=${Config.movieApiKey}`;
    console.log(url);
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            if (data.results.length > 0) {
                for (let i = 0; i < 10 && i < data.results.length; i++) {
                    recommendations.push(data.results[i]);
                    if (i === 9) {
                        console.log(`Recommendation found${recommendations}`);
                        res.render('download', {
                            img, data: torrents, title, recommendations,
                        });
                    }
                }
            } else {
                console.log('recommendations not found');
                res.render('download', {
                    img, data: torrents, title, recommendations: null,
                });
            }
        } else {
            console.log('Error occured in getting the recommendations');
            res.render('download', {
                img, data: torrents, title, recommendations: null,
            });
        }
    });
};

router.get('/download/:imdbId/', async (req, res) => {
    let tmdbId;
    try {
        const foundContent = await ExternalIds.findOne({ imdbId: req.params.imdbId });
        tmdbId = foundContent.tmdbId;
        console.log('Found = ', foundContent);
    } catch (err) {
        // silent
    }

    const url = `https://yts.mx/api/v2/list_movies.json?query_term=${req.params.imdbId}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let data = JSON.parse(body);
            if (data.data.movie_count !== 0) {
                data = data.data.movies[0];
                const img = data.small_cover_image;
                const { title } = data;

                if (tmdbId) {
                    grabRecommendationAndRender(res, tmdbId, img, data.torrents, title);
                } else {
                    res.render('download', {
                        img, data: data.torrents, title, recommendations,
                    });
                }
            } else {
                if (tmdbId) grabRecommendationAndRender(res, tmdbId, 'https://source.unsplash.com/random/1600×1600/?movies', null, null);
                else {
                    res.render('download', {
                        img: 'https://source.unsplash.com/random/1600×1600/?movies', data: null, title: null, recommendations,
                    });
                }
                console.log('Download is not available.');
            }
        } else {
            if (error)console.log('Error in Fetching the download-link = ', error);
            if (response) { console.log('Status Code in Fetching the downloa link = ', response.statusCode); }
            res.render('download', {
                img: 'https://source.unsplash.com/random/1600×1600/?movies', data: null, title: null, recommendations,
            });
            console.log('Download is not available.');
        }
    });
});

router.get('/watch/trailer/:imdbId/*', (req, res) => {
    let url = `https://yts.mx/api/v2/list_movies.json?query_term=${req.params.imdbId}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            if (data.data.movie_count > 0) {
                const { youTubeTrailerCode } = data.data.movies[0];
                url = `https://www.youtube.com/embed/${youTubeTrailerCode}?el=0&wmode=transparent&border=0&autoplay=1`;
                res.redirect(url);
            } else {
                console.log('Trailer not found');
                res.redirect(`/movie/i/${req.params.imdbId}/`);
            }
        } else {
            console.log('Error Occurred in Getting the trailer');
            res.redirect(`/movie/i/${req.params.imdbId}/`);
        }
    });
});

router.get('/*', (req, res) => {
    isRender = false;
    trendingMovies = [];
    theatreMovies = [];
    upcomingMovies = [];
    popularMovies = [];
    start = new Date().getTime();
    grabTrendingMovies(res);
    grabTheatreMovies(res);
    grabUpcomingMovies(res);
    grabPopularMovies(res);
});

router.post('/*', (req, res) => {
    res.status(502).send({ error: 'Please change your method, use get method' });
});

module.exports = router;
