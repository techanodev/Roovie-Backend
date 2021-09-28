import * as path from 'path'
import * as fs from 'fs'

export default class FileService {
    public static absolutePath = (filePath: string) => {
        if (!require.main)
            return './' + filePath
        const lastDir = require.main.filename.split('/')
        const resultPath = lastDir[lastDir.length - 1]
        const absolutePath = path.dirname(require.main.filename.replace(resultPath, '')) + '/' + filePath
        FileService.makeFolder(absolutePath)
        return absolutePath
    }

    public static absoluteDirectory = (path: string) => {
        const directory = FileService.absolutePath(path)
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory)
        return directory
    }

    public static makeFolder = (path: string) => {
        if (path[path.length - 1] == '/')
            path = path.slice(0, path.length - 1)
        const folders = path.split('/')
        folders.splice(folders.length - 1, 1)
        let varPath = ''
        for (const folder of folders) {
            varPath += folder + '/'
            if (fs.existsSync(varPath)) continue
            fs.mkdirSync(varPath)
        }
    }

    public static public = {
        path: FileService.absoluteDirectory('public'),
        absoluteDirectory: (dir: string) => {
            return FileService.absoluteDirectory('public/' + dir)
        },
        absolutePath: (file: string) => FileService.absolutePath('public/' + file),
    }
}