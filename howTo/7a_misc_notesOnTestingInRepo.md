# Notes on the Tests in this Repo

[Return to the README file](../README.md)

**IMPORTANT:** I would usually advise running test with `--watchAll`, however, in the case of development with a remote database, this means making endless calls to the database. In the case of a free instance of MongoDB Atlass, this means very quickly using up all of your free allowance, so I strongly advise NOT using `--watchAll` in such cases.

## Integration Tests

These test the API endpoints and the database together. They are written in the `app.test.js` file and use the `supertest` package to make requests to the server and check the responses.

Example:

```javascript
const response = await request(app).post('/todos').send({ task })
```

Here, `request(app)` is a function from `supertest` that makes a request to the server. `.post('/todos')` is the type of request and the endpoint. `.send({ task })` is the data being sent with the request.

In the `response` object, you can check the status code and the body of the response, e.g.

```javascript
expect(response.status).toBe(200)
expect(response.body.length).toBe(1)
expect(response.body[0].task).toBe(task)
expect(response.body[0].completed).toBe(completed)
```

## Controller Function Unit Tests

These test the controller functions in isolation and use `Jest` to mock the `req` and `res` objects, and the `next` function.

Example:

```javascript
// Arrange
const mReq = {
  params: { id },
  body: { task, completed },
}
const mRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}
const mNext = jest.fn()
```

This is the most complex example taken from an `updateTodo` function test.

The `mReq` object is a mock request object with `params` and `body` properties.
The `mRes` object is a mock response object with `status` and `json` methods.
`mNext` is a mock of the `next` function.

It is important to note here that `status` and `json` are both methods that have parameters passed to them.

In the assertions, there are two principle approaches.

- Assert a method `toHaveBeenCalledWith` a specific parameter.
- Assert the value of an argument of a call in the `mock.calls` array.

### The `toHaveBeenCalledWith` approach

Given the controller function code:

```javascript
res.status(200).json(results.rows)
```

We can see that `res` has been called with the argument `200` and `json` has been called with the argument `results.rows`.

For the sake of example, let's say that `results.rows` is an array with a single object in it:

```javascript
const results = {
  rows: [{ id: 1, task: 'Eat', completed: true }],
}
```

The `mock.calls` array is an array of the calls to a method.
So, `mock.calls[0]` is the first call to the method.
And, `mock.calls[0][0]` is the first argument of the first call to the method, which in the above example is an array containing a single object.
And so on, `mock.calls[0][0][0]` is the first (and in this case only) object in the array.

It follows then, that `mRes.status.mock.calls[0][0]` is the first argument of the first call to the `status` method of the `mRes` object which is the mock of the `res` object.

So, following the example above, we can assert:

```javascript
expect(mRes.status).toHaveBeenCalledWith(200)
expect(mRes.json).toHaveBeenCalledWith([
  { id: 1, task: 'Eat', completed: true },
])
```

### The `mock.calls` approach

But, we can also assert:

```javascript
expect(mRes.status.mock.calls[0][0]).toBe(200)
expect(mRes.json.mock.calls[0][0]).toBe([
  { id: 1, task: 'Eat', completed: true },
])
```

Or even:

```javascript
expect(mRes.status.mock.calls[0][0]).toBe(200)
expect(mRes.json.mock.calls[0][0][0].id).toBe(1)
expect(mRes.json.mock.calls[0][0][0].task).toBe('Eat')
expect(mRes.json.mock.calls[0][0][0].completed).toBe(true)
```

These are ways of saying the same thing. In some cases one is easier and more readable than others.

## Test results

| <img src="howToImages/testResult.png" alt="test result example" width="500" /> |
| ----------------------------------------------------------------------------------------------------------------- |

This shows the results of the tests in the terminal.

Although there are 100 tests in this case, many are duplicated in their functionality to demonstrate different ways of doing the same thing which should not be done in a real world scenario.

[Return to the README file](../README.md)