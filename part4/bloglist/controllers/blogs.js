const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.likes) {
    body.likes = 0
  }
  if (!body.title || !body.url) {
    return response.status(400).end() // Don't forget the return
  }

  const user = request.user // Getting from middleware

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  // check the user has the valid token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user

  // find the blog
  const blog = await Blog.findById(request.params.id)
  // If user associated with blog post matches id from token...
  if ( blog.user.toString() === user.id.toString()) {
    // delete it.
    await Blog.findByIdAndDelete(blog.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'insufficient authorization' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    "title": body.title,
    "author": body.author,
    "url": body.url,
    "likes": body.likes,
    "id": body.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter