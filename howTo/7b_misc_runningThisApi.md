# How to set up and run this API

## Set up

**NOTE:** this requires a MongoDB Atlas database instance

- Clone this repository.
- Run `npm install` to install the dependencies.
- Create a `.env` file in the root of the project and add the following environment variables:
    - `MONGODB_USERNAME=<your-username>`
    - `MONGODB_PASSWORD=<your-password>`
    - `MONGODB_DATABASE_NAME=<your-database-name>`
    - `MONGODB_CLUSTER_REF=<your-cluster-reference>` e.g. cluster0.kdyng
- Replace `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_DATABASE_NAME` and `MONGODB_CLUSTER_REF` with your Mongo DB Atlas details.
- Create a database called `todo_DEV` in MongoDB Atlas with a collection called `todos` for local API use.
- Create a database called `todo_TEST` in MongoDB Atlas with a collection called `todos` for running tests.
- Run the scripts `npm run seed:todos:dev` and `npm run seed:todos:test` to seed the databases.
- Run `npm start` to start the server.
- Use a tool like Postman to make requests to the API.
- If available, `https://localhost-client.onrender.com/` can be used as a basic example client for use with this API.
- Run `npm test` to run the tests.

[Return to the README file](../README.md)