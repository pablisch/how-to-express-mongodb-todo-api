# Creating database seeding functions and scripts

[Jump to final code for this section](#final-code-for-this-section)

In the file, `seedTodos.js`, import the `Todo` schema, `todoSeedData` and the database connection function:

```javascript
const Todo = require('../models/todo')
const todoSeedData = require('./todosSeedData')
const connectToDatabase = require('../db')
```

## Functions to delete and insert todos

Next, write functions to clear the database and write the seed data:

```javascript
const clearTodos = async () => {
  await Todo.deleteMany({})
}

const insertTodos = async () => {
  await Todo.insertMany(todoSeedData)
}
```

**NOTE:** These separate functions aren't really necessary as they simply get called inside `seedTodos` and the code is not re-used but they do make the code clearer and separate concerns.

## The overall seeding function

```javascript
const seedTodos = async (logSuccess = true) => {
  try {
    await connectToDatabase(logSuccess)
    await clearTodos()
    await insertTodos()
    if (logSuccess) console.log('Todo seeding completed successfully.')
  } catch (error) {
    console.error('Todo seeding failed:', error)
  } finally {
    if (logSuccess) process.exit(0)
  }
}
```

And finally, export the function:

```javascript
module.exports = seedTodos
```

I also added some comments at the end as a reminder of use and the scripts that will be written:

```javascript
// for TEST db => npm run seed:todos:test
// for dev/production db => npm run seed:todos:dev
// when used for testing seeding, pass in logSuccess as false
```

**NOTE:**

- The `logSuccess` param (mentioned previously) allows for logging to be suspended for successful calls as this works much better for re-seeding in tests.
- `logSuccess` since is it only used in test re-seeding, also stops the `process.exit(0)` call which would stop tests from running.

## Function call for seeding scripts

For seeding scripts, we need a file that will simply call `seedTodos`.

In `callSeedTodos.js`, import the `seedTodos` function and call it:

```javascript
const seedTodos = require('./seedTodos')

;(async () => {
  try {
    await seedTodos()
    console.log('Seeding completed successfully 🌱')
  } catch (error) {
    console.error('Seeding failed:', error)
  }
})()
```

**NOTE:**

- This could simply be `seedTodos` but this calls the function without an `await`
- This way is longer and not so readable but:
  - it includes error handling
  - uses `async/await` correctly and so reduces unexpected behaviour
- This type of function that calls itself immediately is called an anonymous IIFE (immediately invoked function expression)
- The leading`;` is needed to separate the IIFE from the preceeding import to tell JavaScript that they are not linked.

## Seeding scripts

The seeding scripts themselves will go in the `package.json` file.

In the `scripts` section, add:

```bash
"seed:todos:dev": "node seed/callSeedTodos.js",
"seed:todos:test": "MONGODB_DATABASE_NAME=todo_TEST node seed/callSeedTodos.js"
```

**NOTE:** The only difference between the scripts is that the `test` todos include setting the environment variable `MONGODB_DATABASE_NAME`. This is used inside the `databaseConnection` function and directs it to the `todos_TEST`.

- Call `npm run seed:todos:dev` to seed the dev database
- Call `npm run seed:todos:test` to seed the test database

[NEXT: Connecting the database and server together](1g_setUp_connectServerAndDatabase.md)

## Final code for this section

### seed/seedTodos.js

```javascript
const Todo = require('../models/todo')
const todoSeedData = require('./todosSeedData')
const connectToDatabase = require('../db')

const clearTodos = async () => {
  await Todo.deleteMany({})
}

const insertTodos = async () => {
  await Todo.insertMany(todoSeedData)
}

const seedTodos = async (logSuccess = true) => {
  try {
    await connectToDatabase(logSuccess)
    await clearTodos()
    await insertTodos()
    if (logSuccess) console.log('Todo seeding completed successfully.')
  } catch (error) {
    console.error('Todo seeding failed:', error)
  } finally {
    if (logSuccess) process.exit(0)
  }
}

module.exports = seedTodos

// for TEST db => npm run seed:todos:test
// for dev/production db => npm run seed:todos:dev
// when used for testing seeding, pass in logSuccess as false
```

### seed/callSeedTodos.js

```javascript
const seedTodos = require('./seedTodos')

;(async () => {
  try {
    await seedTodos()
    console.log('Seeding completed successfully 🌱')
  } catch (error) {
    console.error('Seeding failed:', error)
  }
})()
```

[NEXT: Connecting the database and server together](1g_setUp_connectServerAndDatabase.md)
