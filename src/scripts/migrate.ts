import {sequelize} from '../config/database'
import MoviesDataCrud from '../crud/movies/movies_data.crud'
import MovieDataKey from '../models/movies/movie_data/movie_data_key.models'

const syncDatabase = async () => {
  await sequelize.sync({force: false})
  console.info('Sync completed')
}

/**
 * Load models default values
 */
const fillModels = async () => {
  const types = MovieDataKey.types()
  for (const key in types) {
    if (Object.prototype.hasOwnProperty.call(types, key)) {
      const type = types[key]
      await MoviesDataCrud.createType(type)
      console.log(key, ' has created.')
    }
  }
}


sequelize.authenticate().then(async () => {
  console.log('database connected')

  try {
    await syncDatabase()
    await fillModels()
  } catch (error: any) {
    console.error(error.message)
  }
}).catch((e: any) => {
  console.error(e.message)
})
