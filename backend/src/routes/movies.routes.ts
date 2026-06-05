import { Router } from 'express';
import { MoviesController } from '../controllers/movies.controller';
import { TMDBService } from '../services/tmdb.service';

export function createMoviesRouter(): Router {
  const router = Router();
  const tmdbService = new TMDBService();
  const controller = new MoviesController(tmdbService);

  router.get('/trending', controller.getTrending);
  router.get('/popular', controller.getPopular);
  router.get('/top-rated', controller.getTopRated);
  router.get('/upcoming', controller.getUpcoming);
  router.get('/now-playing', controller.getNowPlaying);
  router.get('/search', controller.search);
  router.get('/genres', controller.getGenres);
  router.get('/genre/:id', controller.getByGenre);
  router.get('/:id', controller.getMovieDetail);

  return router;
}
