# ORDER RESTful API
## Featuring Docker, Node, Express, MongoDB & Mongoose

## About

- [Docker](https://www.docker.com/) as the container service to isolate the environment.
- [Node.js](https://nodejs.org/en/) (Long-Term-Support Version) as the run-time environment to run JavaScript.
- [Express.js](https://expressjs.com/) as the server framework / controller layer
- [MongoDB](https://www.mongodb.com/) as the database layer
- [Mongoose](https://mongoosejs.com/) as the "ODM" / model layer
- [Swagger](https://swagger.io/) as for API documentation and demo

## How to Install & Run

1.  Clone the repo
2.  Set Google Distance Matrix API key in common/config/config.js file line no. 7
3.  Run `./start.sh` to up docker containers
4.  After starting container , testcases will run automatically

## Manually Starting the docker and test Cases

1. You can run `docker-compose up -d` from terminal inside the application folder
2. Server is accessible at `http://localhost:8080`
3. Run manual testcase suite by `docker-compose exec order_api_app npm test`

## How to Run Application (Explicity from cli without Docker Container) 

1. For this you need to install npm and node JS on your local machine. (assuming you have the LTS version of Node installed on your machine).
2. Then run `npm install` inside the application folder. It will install all packages.
3. Then run `npm start`. It will start the node js server and application is accessiable at `http://localhost:8080`.
4. Then run `npm test` to run test cases.

## App Structure

**./index.js**
- `index.js` is the entrypoint that actually starts the Express server

**./test**
- this folder contains test case run using `npm test app/test` which in turn uses [Mocha]

**./schemas**
- `schemas` are [JSONSchema] validation schemas for reading , creating or updating a Order.

**./orders**
- `controllers` are Express.js route handlers that have `request`, `response`, and `next` parameters.
- `middlewares` for validating requests
- `models` are [Mongoose schema] definitions and associated models
- `routes.config.js` are RESTful route declarations using [express]

**./common/config**
- config contains expose port, Google Key & Database config URL.

**./common/services**
- service contains Database connection handler and Google api handler.

## Google API configuration ##
- add google apk key in configuration file located in common/config/config.js

## Swagger integration

1. Open URL for API demo `http://localhost:8080/api-docs`
2. Here you can perform all API operations like GET, UPDATE, POST

## Code Linting 

1. Eslint is used to lint the code.
2. For changes in any rules. Please update `.eslintrc` as per your need.

## Note
- By default 10 records will be displayed when listing order.
