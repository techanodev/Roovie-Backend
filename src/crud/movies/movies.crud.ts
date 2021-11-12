import Movie from '../../models/movies/movies.models';
import MovieFile from '../../models/movies/movie_data/movie_files.models';
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
    // movieFile.typeId =
    return await movieFile.save()
  }
}
