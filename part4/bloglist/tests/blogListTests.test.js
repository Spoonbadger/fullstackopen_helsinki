const { test, describe, beforeEach, after } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')

describe('for when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  describe('for GETtings', () => {
    test('GET request all blog entries returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
    })

    test('verify database _id is called id', async () => {
      const dbBlogs = await helper.blogsInDb()
      const selectedBlog = dbBlogs[0]

      assert.strictEqual(selectedBlog.id.length, 24)
    })
  })

  describe('for POSTings', () => {
    let token
    beforeEach(async () => {

      const newUser = {
        username: 'test123',
        password: 'test123'
      }
      await api
        .post('/api/users')
        .send(newUser)

      const defaultLogin = await api
        .post('/api/login')
        .send({ username: 'test123', password: 'test123' })

      token = defaultLogin.body.token
      assert(token, 'LOGIN FAILED, TOKEN NOT RETURNED')
    })

    test('add a new post 1', async (request) => {
      const newBlog = {
        "title": "testing adding a new post",
        "author": "craig morley",
        "url": "craigmorley.com",
        "likes": 3,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)

      const blogsAfterPost = await helper.blogsInDb()
      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)

      const dbBlog = blogsAfterPost[blogsAfterPost.length - 1]

      assert.strictEqual(newBlog.author, dbBlog.author)
      assert.strictEqual(newBlog.title, dbBlog.title)
      assert.strictEqual(newBlog.url, dbBlog.url)
      assert.strictEqual(newBlog.likes, dbBlog.likes)
    })

    test('add a new post with \'likes\' missing', async () => {
      const newBlog = {
        "title": "testing new post without likes",
        "author": "draig norley",
        "url": "draignorley.com",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)

      const blogsAfterPost = await helper.blogsInDb()
      const dbBlog = blogsAfterPost[blogsAfterPost.length - 1]

      assert.strictEqual(dbBlog.likes, 0)
    })

    test('add a new post with missing \'title\'', async () => {
      const newBlog = {
        "author": "eraig oorley",
        "url": "eraigoorley.com",
        "likes": 1
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterPost = await helper.blogsInDb()

      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
    })

    test('add a new post with missing \'url\'', async () => {
      const newBlog = {
        "author": "eraig oorley",
        "title": "testing post without url",
        "likes": 12
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterPost = await helper.blogsInDb()

      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
    })
  })



  describe('for DELETing posts', async () => {
    test('delete a single post', async () => {
      const blogsDb = await helper.blogsInDb()
      const firstId = blogsDb[0].id

      await api
        .delete(`/api/blogs/${firstId}`)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length -1)

    })
  })

  describe('for UPDATing posts', () => {
    test('update likes', async () => {
      const newLikes = {
        "title": "Ian's Blog",
        "author": "Ian Britt",
        "url": "www.ianisbritt.com",
        "likes": 10,
        "id": "670e7a2eb4bd96924c8b6d56"
      }

      const blogsDb = await helper.blogsInDb()
      const id = blogsDb[1].id

      await api
        .put(`/api/blogs/${id}`)
        .send(newLikes) // Don't forget the payload
        .expect(200)

      const after = await helper.blogsInDb()
      const updated = after[1]

      assert.strictEqual(updated.likes, newLikes.likes)
    })
  })
})





after(async () => {
  await mongoose.connection.close()
})

