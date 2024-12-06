const seedTodos = require('./seedTodos')

;(async () => {
  try {
    await seedTodos()
    console.log('Seeding completed successfully 🌱')
  } catch (error) {
    console.error('Seeding failed:', error)
  }
})()
