const addLike = async updatedObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject, config)
  return response.data
}


import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogLikes }) => {
  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  }
  const buttonStyle = {
    margin: 5,
  }

  const [infoVisible, setInfoVisible] = useState(false)

  const hideWhenInfoVisible = { display: infoVisible ? 'none' : '' }
  const showWhenInfoVisible = { display: infoVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  const addLike = async () => {
    const updatedObject = {
      ...blog,
      likes: blog.likes + 1
    }
    console.log('Bloggsupdated:', updatedObject)
    try {
      const returnedBlog = await blogService.addLike(updatedObject)
      updateBlogLikes(returnedBlog)
    } catch(error) {
      console.log('Could not add a like', error.message);
    }
  }

  return (
    <div>
      <div style={hideWhenInfoVisible}>
        <div style={blogStyle}>
          {blog.title} {blog.author} 
          <button onClick={toggleVisibility} style={buttonStyle}>view</button>
        </div>
      </div>
      <div style={showWhenInfoVisible}>
        <div style={blogStyle}>
          <div>{blog.title}
            <button onClick={toggleVisibility} style={buttonStyle}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>likes: {blog.likes}
            <button onClick={addLike} style={buttonStyle}>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      </div>
    </div>
  )
}

export default Blog


---
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  // If the user is logged in and set in local storage, 
  // save user in session with new token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Show blogs
  useEffect(() => {
    const getBlogs = async () => {
      try { const blogs = await blogService.getAll()
        setBlogs(blogs)
        console.log('Fetched blogs:', blogs)
      } catch(error) {
        console.log('Error fetching blogs:', error);
      }
    }
    getBlogs()
  }, [])

  // Add a blog
  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `New blog: ${blogObject.title} by ${blogObject.author} added`, type:'success' })
      setTimeout(() => {
        setNotification(null)
      }, 4500)
    } catch(exception) {
      setNotification({ message: 'failed to create new blog', type:'error' })
      console.log(exception)
      setTimeout(() => {
        setNotification(null)
      }, 4500)
    }
  }

  // Update blog likes
  const updateBlogLikes = (returnedBlog) => {
    setBlogs((currentBlogs) => {
      return currentBlogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog)
    })
  }


  // Display user form if user selects to login
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm 
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("HandlingLogin with...", username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      if (!user) {
        console.log("no user :( ):", user)
      }
      console.log('userinfo:', user)

      window.localStorage.setItem(
        'loggedInBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setNotification({ message: 'Incorrect credentials', type:'error' })
      setTimeout(() => {
        setNotification(null)
      }, 4500)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setNotification({ message: `${user.name} logged out.`, type:'error' })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
    window.localStorage.clear()
    setUser(null)
  }

  const blogFormRef = useRef()
  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  

  if (user === null) { return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={ notification?.message } type={ notification?.type } />
      {loginForm()}
    </div>
  )}
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={ notification?.message } type={ notification?.type}/>
      <p><span>{user.name} logged in</span><button onClick={handleLogout}>logout</button></p>
      <div>
        {blogForm()}
      </div>
      {blogs.map(blog =>
        <Blog 
          key={blog.id}
          blog={blog}
          updateBlogLikes={updateBlogLikes}
        />
      )}
    </div>
    )
  }


export default App