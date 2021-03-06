import { Request, Response } from 'express'

import MoviesCrud from '../../crud/movies/movies.crud'
import Movie, { MovieI } from '../../models/movies/movies.models'
import Controller from '../controllers'
import ResponseService from '../../services/response.services'
import RequestService from '../../services/request.services'
import ModelService from '../../services/model.services'
import MoviesResource from '../../resources/movies/movies.resources'

/**
 * Movies controller, use movies crud to link to routes
 */
export default class MovieController extends Controller {
  /**
   * Handle request for create new movie by request and resource
   * @param {Request} req
   * @param {Response} res
   */
  static createMovieByUrl = async (req: Request, res: Response) => {
    try {
      MovieController.checkValidationResult(req)
      const request = RequestService.newInstance(req)
      let movie = new Movie()
      // Fill movie model by user body request
      movie = ModelService.fillModel<Movie, MovieI>(req.body, movie)
      // Set creator as request sender
      movie.userId = (await request.user())?.id as number

      const movieCrud = new MoviesCrud(movie)
      const url = req.body.url
      const result = await movieCrud.movieFromUrl(url)
      ResponseService.makeNew(res)
        .model.success.create(result.movie.id as number, 'فیلم').response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * Get list of movies that user has created
   * @param {Express.Request} req Request
   * @param {Express.Response} res Response
   */
  static getUserMovies = async (req: Request, res: Response) => {
    try {
      const request = new RequestService(req)
      const userId = (await request.user())?.id ?? 0
      const movies = await MoviesCrud.userMovies(userId, request.pagination())
      MovieController.
        responseModels(res, 'movies', movies, MoviesResource, req)
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }
}
