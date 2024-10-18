const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "Egg blog",
    "author": "Jose Princeton",
    "url": "www.niceblog.com",
    "likes": 4,
    "id": "670e78f067127f552f603f44"
  },
  {
    "title": "Ian's Blog",
    "author": "Ian Britt",
    "url": "www.ianisbritt.com",
    "likes": 5,
    "id": "670e7a2eb4bd96924c8b6d56"
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}