# How to build an Express Todo API with MongoDB Atlas Database setup

This repository is a dual app/guide to create a simple API with a MongoDB database. It uses a `todo` API as its basis but its principles are applicable to any API usage. Its primary use intention is as a guide to creating the API and an explanation of the steps and so for the sake of brevity, please see [about this repository](howTo/7c_misc_aboutThisRepo.md) for more detail, or [running this API]() for info on how to actually run the included Express server. Otherwise, the following chapters are for building your own server.

## Contents

### Setup - database, repository, Express server and connections

1. [MongoDB database and connecting to MongoDB Compass](howTo/1a_setUp_mongoDbDatabase.md)
2. [Set up the repository](howTo/1b_setUp_repository.md)
3. [Create a basic Express server](howTo/1c_setUp_expressServer.md)
4. [Create the Todo schema and seeds](howTo/1d_setUp_todoSchemaAndSeeds.md)
5. [Database connection](howTo/1e_setUp_databaseConnection.md)
6. [Create the seeding function and scripts](howTo/1f_setUp_seedingFunctions.md)
7. [Connect the server and the database](howTo/1g_setUp_connectServerAndDatabase.md)

### GET /todos

**NOTE:** Choose either [Step 1](howTo/2a_getTodos_stepByStep.md) or [Step 2](howTo/2b_getTodos_StraightToController.md) here as they both end at exactly the same point. If you are unconfident with Express servers then [Step 1](howTo/2a_getTodos_stepByStep.md) may be beneficial. If you are familiar with the controller/route pattern then go straight to [Step 2](howTo/2b_getTodos_StraightToController.md).

1. [Step by step - starting in app.js](howTo/2a_getTodos_stepByStep.md)
2. [Add the GET /todos endpoint (directly as controller function and route)](howTo/2b_getTodos_StraightToController.md)
3. [getAllTodos controller function unit test](howTo/2c_getTodos_UnitTests.md)
4. [GET /todos endpoint integration tests](howTo/2d_getTodos_integrationTests.md)

### GET /todos/:id

1. [GET /todos/:id_endpoint](howTo/3a_getTodoById_endpoint.md)
2. [getTodoById_controller unit tests](howTo/3b_getTodoById_unitTests.md)
3. [GET /todos/:id_endpoint_integration tests](howTo/3c_getTodoById_integrationTests.md)

### POST /todos

1. [POST /todos_endpoint](howTo/4a_createTodo_endpoint.md)
2. [createTodo_controller unit tests](howTo/4b_createTodo_unitTests.md)
3. [POST /todos_endpoint_integration tests](howTo/4c_createTodo_integrationTests.md)

### DELETE /todos/:id

1. [DELETE /todos/:id_endpoint](howTo/5a_deleteTodo_endpoint.md)
2. [deleteTodo_controller unit tests](howTo/5b_deleteTodo_unitTests.md)
3. [DELETE /todos/:id_endpoint_integration tests](howTo/5c_deleteTodo_integrationTests.md)

### PATCH /todos/:id

1. [PATCH /todos/:id_endpoint](howTo/6a_updateTodo_endpoint.md)
2. [updateTodo_controller happy path unit tests](howTo/6b_updateTodo_happyPathUnitTests.md)
3. [updateTodo_controller error handling unit tests](howTo/6c_updateTodo_errorHandlingUnitTests.md)
4. [PATCH /todos/:id_endpoint happy path_integration tests](howTo/6d_updateTodo_happyPathIntegrationTests.md)
5. [PATCH /todos/:id_endpoint error handling_integration tests](howTo/6e_updateTodo_errorHandlingIntegrationTests.md)

### Miscellaneous

1. [Notes on testing in this repository](howTo/7a_misc_notesOnTestingInRepo.md)
