# About this repository

- This project is a guide to building an API with a MongoDB database.
- It provides a dual resource:
  - A step-by-step guide to building the API including setting up the database
  - A full example API in code
- This project uses `todos` as its example object but the principle is the same for any RESTful API.
- The primary purpose of this project is as a `how to` guide and this guide begins [here](1a_setUp_mongoDbDatabase.md).
- The secondary purpose is as a working example API. To use this, see the [set up instructions](7b_misc_runningThisApi.md).
- The order in which much of the API and database instructions are carried is largely optional. These instructions provide one possible order.
  - Notably, `PATCH` would usually come before `DELETE` but this seems very odd to me and so I have shown `DELETE` first.

## Documented limitations

- This project uses `commom JS` modules and provides no examples of equivalent `ES6 modules`
- This project uses a MongoDB Atlas database and provides no information about using a local MongoDB database
- There is no example of authorisation or permissions in the project
- The project uses `cors` openly so there is no cross-origin protection
- There is no `PUT` endpoint, although the `PATCH` endpoint works fine as a `PUT` endpoint in this instance