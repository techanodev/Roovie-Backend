import Movie from '../../models/movies/movies.models';
import Resource from '../resources';

/**
 * Resource for movies
 */
export default class MoviesResource extends Resource<Movie> {
  /**
   * Make resource from movies model
   * @param {boolean} isCollection
   * @return {Dict}
   */
  toArray(isCollection?: boolean): { [key: string]: any; } {
    const data: {[key: string]: any} = {
      'title': this.model.name,
      'title_lang': {
        'fa': this.model.name,
        'en': this.model.nameEnglish,
      },
      'duration': this.model.duration,
    }

    if (isCollection && this.model.files) {
      data['files'] = this.model.files.map((file) => {
        return {
          'path': file.path,
          'type': file.type,
        }
      })
    }

    return data
  }
}
