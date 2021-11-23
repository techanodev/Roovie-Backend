import MoviesCrud from '../../crud/movies/movies.crud'
import Movie from '../../models/movies/movies.models'
import '../config.test'
import {fakeUser} from './users.test'
import faker = require('faker')

const OLD_ENV = process.env

beforeEach(() => {
  jest.resetModules() // Most important - it clears the cache
  process.env = {...OLD_ENV} // Make a copy
})

afterAll(() => {
  process.env = OLD_ENV // Restore old environment
})

test('Create movie by URL', async () => {
  const url = 'https://google.com'
  const user = fakeUser({number: faker.phone.phoneNumber('912#######')})
  await user.save()
  const movie = new Movie()
  movie.name = 'نام فیلم'
  movie.nameEnglish = 'Movie name'
  movie.duration = 120
  movie.isPublic = false
  movie.userId = user.id as number
  const movieCrud = new MoviesCrud(movie)
  await movieCrud.movieFromUrl(url)
})
