const bcrypt = require('bcrypt')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const User = require('../models/user')
const helper = require('./tests_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)


describe('when there is intially one user in the DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User ({
      username: 'root',
      passwordHash
    })
    await user.save()
  })

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Daniel123",
      name: "Dan",
      password: "rotund"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersAtStart.length + 1)

    const usernames = usersAfter.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('invalid user requested; too short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "cr",
      name: "draig chorley",
      password: "eyup123"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('username is NOT unique!', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'rooty',
      password: 'anexample123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })
})





after(async () => {
  await mongoose.connection.close()
})