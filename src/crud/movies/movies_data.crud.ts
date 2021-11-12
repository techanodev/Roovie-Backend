import Crud from '../crud'
// Models
import MovieDataKey,
{MovieDataKeyI} from '../../models/movies/movie_data/movie_data_key.models'

/**
 * Movies data create read update delete
 */
export default class MoviesDataCrud extends Crud<MovieDataKey> {
  /**
     * Create new movie meta data key
     * @param {MovieDataKey} data
     */
  static async createType(data: MovieDataKeyI) {
    const typeModel = await MovieDataKey.findOrCreate({where: data})
    return typeModel
  }
}
