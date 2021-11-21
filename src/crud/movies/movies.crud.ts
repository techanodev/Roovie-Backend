import Movie from '../../models/movies/movies.models';
import MovieFile from '../../models/movies/movie_data/movie_files.models';
import Pagination from '../../types/pagination.types';
import Crud from '../crud';

/**
 * Crud for movie model
 */
export default class MoviesCrud extends Crud<Movie> {
  /**
     * Save movie file from external url
     * @param {string} url url of user want download to server
     */
  async movieFromUrl(url: string) {
    const movie = await this.model.save()
    const movieFile = new MovieFile()
    movieFile.movieId = movie.id
    movieFile.path = url
    movieFile.type = 'movie'
    await movieFile.save()
    return {
      movie: movie,
      files: [movieFile],
    }
  }

  /**
   * get list of movies that user has created
   * @param {number} userId
   * @param {Pagination} pagination
   * @return {{rows: Movie[], count: number}}
   */
  public static userMovies =
   async (userId: number, pagination?: Pagination):
   Promise<{rows: Movie[], count: number}> => {
     if (!pagination) {
       pagination = Pagination.default()
     }
     const movies = await Movie.findAndCountAll({
       where: {userId: userId},
       limit: pagination.countPerPage,
       offset: pagination.skip,
       include: Movie.include({movieFiles: true}),
     })
     return movies
   }
}
