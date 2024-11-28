const mongoose = require('mongoose');
const Todo = require('../models/todo');
const todoSeedData = require('./todosSeedData');
require('dotenv').config();

const dbPassword = process.env.MONGODB_PASSWORD;
const dbUser = process.env.MONGODB_USERNAME;
const cluster = process.env.MONGODB_CLUSTER_REF;
const dbName = process.env.MONGODB_DATABASE_NAME || 'todo_DEV';

const mongoDbUri = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/${dbName}`;

mongoose
    .connect(mongoDbUri)
    .then(() => {
        // console.log(`🥳 Successfully connected to MongoDB Atlas ${dbName} database! 🌎!!!`);
    })
    .catch((error) => {
        // console.log(`😖 Unable to connect to MongoDB Atlas ${dbName} database! ❌`);
        console.error(error);
    });

const clearTodos = async () => {
    await Todo.deleteMany({});
};

const insertTodos = async () => {
    await Todo.insertMany(todoSeedData);
};

// for TEST db => npm run seed:todos:test
// for dev/production db => npm run seed:todos
const seedTodosForTests = async () => {
    try {
        await clearTodos();
        await insertTodos();
    } catch (error) {
        console.error('Todo seeding failed:', error);
    }
}

module.exports = seedTodosForTests
