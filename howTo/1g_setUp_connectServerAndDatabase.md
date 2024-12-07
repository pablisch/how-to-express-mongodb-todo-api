# Connect the server to the database

[Jump to final code for this section](#final-serverjs-code)

We now have a basic Express server, a MongoDB database and a database connection function. Now we bring them together:

```javascript
const app = require('./app')
const port = process.env.PORT || 3000
const connectToDatabase = require('./db')

;(async () => {
  try {
    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
})()
```

That is all the code needed to achieve the database connection. I have chosen to have a separate `databaseConnection` function and use it in `server.js` for separation of concerns and its use in `server.js` stops it from being called in `app.js` integration tests.

There is no further development in thsi chapter and you can move straight on. All the following explanation is just an explanation of the above code and how it got to that point.

NEXT UP:

[GET /todos route in app.js (simple step by step version)](2a_getTodos_stepByStep.md)

OR

[GET /todos route as controller function and route](2b_getTodos_StraightToController.md)

**NOTE:** Both steps will end up with the same result. If you choose the first option (app.js) then this will be refactored into a controller function and route.

Or, read on for an explanation of the code above.

## Step by step explanation

The starting point for this section was our `server.js` file:

```javascript
const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

The minimal step to add the database connection would be to import the connection function and call it:

**EXAMPLE CODE NOT USED IN THIS APP**

```javascript
const app = require('./app')
const port = process.env.PORT || 3000
const connectToDatabase = require('./db')

connectToDatabase()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

This would work but:

- there is a separation between the connection to the database and the server starting when both are fundamental to the app working
- the async function, `connectToDatabase`, is being called without await since `await is only valid in async functions and the top level bodies of modules`

### Joining the database connection and server start with error handling

**EXAMPLE CODE NOT USED IN THIS APP**

```javascript
const startServer = async () => {
  try {
    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
}

startServer()
```

Here, there is a single function with error handling but it still calls the `async` function without an `await`. This is fine but can be improved on.

### Creating an IIFE function

```javascript
;(async () => {
  try {
    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
})()
```

**NOTES:**

- This is an IIFE (immediately invoked function expression)
- The preceding `;` stops the function from being joined to the preceding import call and causing an error. Where lines end in a `;` anyway, this is not an issue. As I often use a prettier setting to remove end of line punctuation, this becomes essential.

And we are back to the final code shown at the beginning of this chapter with no `async/await` issue, joined and with error handling.

NEXT UP:

[GET /todos route in app.js (simple step by step version)](2a_getTodos_stepByStep.md)

OR

[GET /todos route as controller function and route](2b_getTodos_StraightToController.md)

**NOTE:** Both steps will end up with the same result. If you choose the first option (app.js) then this will be refactored into a controller function and route.

## Final server.js code

```javascript
const app = require('./app')
const port = process.env.PORT || 3000
const connectToDatabase = require('./db')

;(async () => {
  try {
    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
})()
```

NEXT UP:

[GET /todos route in app.js (simple step by step version)](2a_getTodos_stepByStep.md)

OR

[GET /todos route as controller function and route](2b_getTodos_StraightToController.md)

**NOTE:** Both steps will end up with the same result. If you choose the first option (app.js) then this will be refactored into a controller function and route.
