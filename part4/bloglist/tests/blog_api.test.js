// const bcrypt = require('bcrypt')
// add { test, } below.
const {  describe, beforeEach, after } = require('node:test')
// const assert = require('assert')
const Blog = require('../models/blog')
// const helper = require('./tests_helper')
// const supertest = require('supertest')
const mongoose = require('mongoose')
// const app = require('../app')
// const api = supertest(app)


describe('when there is intially one blog in the DB', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blog = new Blog ({
      title: 'root',
      author: 'John Doe',
      url: "bananas.com",
    })
    await blog.save()
  })

  //   test('deleting the blog', async () => {
  //     const blogsAtStart = await helper.blogsInDb()
  //     const blogToDelete = blogsAtStart[0]

  //     await api
  //       .delete(`/api/blogs/${blogToDelete.id}`)
  //       .expect(204)

  //     const blogsAtEnd = helper.blogsInDb()

  //     assert.strictEqual(blogsAtEnd.length, blogsAtStart.length -1)

//   })
})


after(async () => {
  await mongoose.connection.close()
})