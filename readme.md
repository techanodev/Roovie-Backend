[![Node.js CI](https://github.com/Techano-Developers/Roovie-Backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/Techano-Developers/Roovie-Backend/actions/workflows/node.js.yml)

# Roovie Backend

**Roovie** is a service that aims to create an environment for watching movies with other people at the same time.

## Get started

at first make sure you installed **node js** and **npm**

``` bash
    # for check node js installed
    $ node -v
    # for check npm installed
    $ npm -v
```

then run these commands in terminal for install project's dependencies:

``` bash
    # For install all dependencies for develop project
    $ npm i
    # For install just packages to build and run project
    $ npm i --save-prod
```

## Config

make a copy from **.env.example** and name it **.env**.

open new .env file and edit the config values such as database's configs.

> Please fill all environment settings

## Database

This project for record data such as users and movies use database.

To get acquainted with the structure of the project database, you can read the OneDrive project.

### Database config

For set your database config you can edit .env file.
prefix database configs in .env file is **DB**

``` bash
    # type of your database, for example **mysql** or **sqlite**
    DB_TYPE=sqlite|mysql
    # address of your host for database
    DB_HOST=localhost
    # Database name on server
    DB_NAME=roovie
    # Username to access the database
    DB_USER=root
    # Password for user
    DB_PASSWORD=1234
```

### Migrate database

for migrate database with tables that project need you can run below command in terminal:

```bash
    npm run migrate
```

## Run and Build Project

for **run** project you can use this command

``` bash
    # Run project
    $ npm start
    # Run project with auto restart program after editing codes
    $ npm run dev
```

for **build** project you can run this command

``` bash
    # For building project
    npm run build
    # For start the build of project
    node ./dist/app.js
```
