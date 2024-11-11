const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// New blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('Raw request body:', request.body)

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

  try { const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
  } catch (error) {
    console.log('error in blogsRouter.put:', error.message)
  }
})


// Comments and commenting below

// Get comments
blogsRouter.get('/:blogId/comments', async (request, response) => {
  const { blogId } = request.params
  try {
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(blog.comments)
  } catch (error) {
    console.log("error blogsRouterGET:", error.message)
  }
})

// New comment
blogsRouter.post('/:blogId/comments', async (request, response) => {
  const { text } = request.body
  const { blogId } = request.params

  try {
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    const newComment = { text }
    blog.comments.push(newComment)
    await blog.save()

    const commentId = blog.comments[blog.comments.length - 1]._id

    response.status(201).json({ message: 'Comment added!', comment: { ...newComment, blogId, id: commentId } })
  } catch (error) {
    console.error('Server error:', error.message)
    response.status(500).json({ error: 'Server error' })
  }
})


module.exports = blogsRouter