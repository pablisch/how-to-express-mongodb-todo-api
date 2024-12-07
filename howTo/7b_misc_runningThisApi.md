# How to set up and run this API

EVERYTHING BELOW IS CUT FROM THE ORIGINAL README - WHAT NEEDS TO BE CUT OR ADDED?

## Set up

The purpose of this project as a guide, not to run the API, but should you wish to run the API included in this repo, then follow these steps:

- Clone this repository.
- Run `npm install` to install the dependencies.
- Create a `.env` file in the root of the project and add the following environment variables:
    - `MONGODB_USERNAME=<your-username>`
    - `MONGODB_PASSWORD=<your-password>`
    - `MONGODB_DATABASE_NAME=<your-database-name>`
    - `MONGODB_CLUSTER_REF=<your-cluster-reference>` e.g. cluster0.kdyng
- NOTE: this requires a MongoDB Atlas database instance
- Replace `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_DATABASE_NAME` and `MONGODB_CLUSTER_REF` with your Mongo DB Atlas details.
- Create a database called `todo_DEV` in MongoDB Atlas.
- Run the scripts `npm run seed:todos:dev` and `npm run seed:todos:test` to seed the databases.
- Run `npm start` to start the server.
- Use a tool like Postman to make requests to the API.
- Run `npm test` to run the tests.