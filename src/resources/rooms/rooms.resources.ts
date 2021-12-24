import Resource, { ResourceType } from '../resources'
import MovieResource from '../movies/movies.resources'
import Room from '../../models/rooms/rooms.models'
import UserResource from '../users/users.resources'

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
      'id': this.model.id,
      'title': this.model.title,
      'description': this.model.description,
      'schedule': {
        'start_time': this.model.startTime,
        'end_time': this.model.endTime,
      },
    }
    if (this.model.movie) {
      result.movie = new MovieResource(this.model.movie).toArray()
    }
    if (this.model.userRooms?.length) {
      result['users'] = UserResource.collection(this.model.userRooms?.filter(x => x.user).map(x => x.user))
    }
    return result
  }
}
