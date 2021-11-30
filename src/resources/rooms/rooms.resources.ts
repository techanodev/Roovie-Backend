import Resource, {ResourceType} from '../resources'
import MovieResource from '../movies/movies.resources'
import Room from '../../models/rooms/rooms.models'

/**
 * Resource and structure for rooms
 */
export default class RoomResource extends Resource<Room> {
  /**
   * To array a room model for response
   * @return {ResourceType}
   */
  toArray(): ResourceType {
    const result: ResourceType = {
      'title': this.model.title,
    }
    if (this.model.movie) {
      result.movie = new MovieResource(this.model.movie).toArray()
    }
    return result
  }
}
