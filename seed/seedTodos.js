const Todo = require('../models/todo')
const todoSeedData = require('./todosSeedData')
const connectToDatabase = require('../db')

const clearTodos = async () => {
    await Todo.deleteMany({});
};

const insertTodos = async () => {
    await Todo.insertMany(todoSeedData);
};

const seedTodos = async (databaseName) => {

    try {
        await connectToDatabase()
        await clearTodos();
        await insertTodos();
        console.log('Todo seeding completed successfully.');
    } catch (error) {
        console.error('Todo seeding failed:', error);
    } finally {
        process.exit(0);
    }
};

module.exports = seedTodos

// for TEST db => npm run seed:todos:test
// for dev/production db => npm run seed:todos:dev
