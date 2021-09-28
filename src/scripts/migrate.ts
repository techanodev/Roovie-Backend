import { sequelize } from '../config/database'


sequelize.authenticate().then(async () => {
    console.log("database connected")

    try {
        await sequelize.sync({ force: false })
        console.log('Done')
    } catch (error: any) {
        console.error(error.message)
    }

}).catch((e: any) => {
    console.error(e.message)
})