const express = require('express');
const app = express();
const moviesController = require('../Controllers/moviesController');
const router = express.Router();



//we can short all route like this by using app.route
router.route('/').get(moviesController.getallmovie).post(moviesController.createmovie);
router.route('/highest-rated').get(moviesController.getHighestratedMovie,moviesController.getallmovie);
router.route('/movie-stats').get(moviesController.getMovieStats);
router.route('/:actors').get(moviesController.getMoviebyactor);


router.route('/:id').get(moviesController.getmovie).patch(moviesController.updatemovie).delete(moviesController.deletemovie);



module.exports = router;