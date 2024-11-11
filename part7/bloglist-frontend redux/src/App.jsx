import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, logoutUser } from './reducers/userReducer'
import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"


const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  // If the user is logged in and set in local storage,
  // save user in session with new token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInBlogUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user.token) {
        dispatch(setUser(user))
        blogService.setToken(user.token)
      }
    }
  }, [])


  // Show blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const blogs = useSelector(state => state.blogs)
  console.log("Fetched blogs:", blogs)


  // Display user form if user selects to login
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" }
    const showWhenVisible = { display: loginVisible ? "" : "none" }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logoutUser())
    dispatch(setNotification({
      message: `${user.username} logged out.`,
      type: "error"
    }, 4))
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        <span>{user.name} logged in</span>
        <button data-testid="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <div>{blogForm()}</div>
      {blogs
        .filter(blog => blog && blog.id)
        .map(blog => (
          <Blog key={blog.id} id={blog.id} user={user} />
        ))}
    </div>
  )
}

export default App
