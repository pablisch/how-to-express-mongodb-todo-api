# Connecting to the database function

[Jump to final code for this section](#final-dbjs-code)

Many apps have the database connection in `app.js` but since we will need to connect to the database to seed out database and re-seed for tests, it makes sense to have a separate function to handle this. It also makes a tidier `app.js` and separates concerns nicely. In this app, we will actually call the database connection in `server.js` as we will see in the next chapter.

In the currently empty `db.js` file, import `dotenv` and `mongoose`:

```javascript
require('dotenv').config()
const mongoose = require('mongoose')
```

Declare constants for environment variables that will make up the `MongoDB URI` string:

```javascript
const dbPassword = process.env.MONGODB_PASSWORD
const dbUser = process.env.MONGODB_USERNAME
const cluster = process.env.MONGODB_CLUSTER_REF
const dbName = process.env.MONGODB_DATABASE_NAME || 'todo_DEV'

const mongoDbUri = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/${dbName}`
```

Write the function to connect to the database:

```javascript
const connectToDatabase = async (logSuccess = true) => {
  try {
    await mongoose.connect(mongoDbUri)
    if (logSuccess)
      console.log(
        `🥳 Successfully connected to MongoDB Atlas ${dbName} database! 🌎`,
      )
  } catch (error) {
    console.log(`😖 Unable to connect to MongoDB Atlas ${dbName} database! ❌`)
    console.error(error)
    process.exit(1)
  }
}
```

And finally, export the function:

```javascript
module.exports = connectToDatabase
```

**NOTE:**

- the database name, `dbName` is `todo_DEV` by default but will be the value of the environment variable `MONGODB_DATABASE_NAME` where it is set.
- `connectToDatabase` takes the param `logSuccess` because console logging in tests causes issues and this allows me to stop any logging that creates 'noise' when running tests. It also provides a mechanism to stop `process.exit()` when reseeding which will see soon.
- There is no need to console log any connection message on success but it can be useful when starting out and especially useful to be explicitly sure what database you have connected to.

[NEXT: Creating seeding functions and scripts](1f_setUp_seedingFunctions.md)

## Final db.js code

```javascript
require('dotenv').config()
const mongoose = require('mongoose')

const dbPassword = process.env.MONGODB_PASSWORD
const dbUser = process.env.MONGODB_USERNAME
const cluster = process.env.MONGODB_CLUSTER_REF
const dbName = process.env.MONGODB_DATABASE_NAME || 'todo_DEV'

const mongoDbUri = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/${dbName}`

const connectToDatabase = async (logSuccess = true) => {
  try {
    await mongoose.connect(mongoDbUri)
    if (logSuccess)
      console.log(
        `🥳 Successfully connected to MongoDB Atlas ${dbName} database! 🌎`,
      )
  } catch (error) {
    console.log(`😖 Unable to connect to MongoDB Atlas ${dbName} database! ❌`)
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectToDatabase
```

[NEXT: Creating seeding functions and scripts](1f_setUp_seedingFunctions.md)
