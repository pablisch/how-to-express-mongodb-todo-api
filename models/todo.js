const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Todo', todoSchema)
