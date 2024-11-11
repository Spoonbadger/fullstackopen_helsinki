import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import tokenService from './services/token'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { getAllUsers } from "./reducers/usersReducer"
import { setUser, logoutUser } from './reducers/userReducer'
import { useSelector } from 'react-redux'
import BlogsView from './pages/BlogsView'
import BlogView from './pages/BlogView'
import UsersView from './pages/UsersView'
import UsersBlogsView from "./pages/UsersBlogsView"
import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'



const padding = {
  padding: 5,
}

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  // If the user is logged in and set in local storage,
  // save user in session with new token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      tokenService.setToken(user.token)
      window.localStorage.setItem('token', user.token)
    }
  }, [])
  

  // Show blogs
  useEffect(() => {
    dispatch(initializeBlogs())
    }, [])
  console.log('Fetched blogs:', blogs)

  // Get users
  useEffect(() => {
    dispatch(getAllUsers())
  }, [])
  const users = useSelector(state => state.users)
  
  // Display user form if user selects to login
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button className='btn btn-primary' onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm />
          <button className='btn btn-danger' onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logoutUser())
    dispatch(setNotification({ message: `${user.username} logged out.`, type:'error' }, 4.5))
  }


  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const userMatch = useMatch('/users/:id')
  const userChoice = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null


  if (user === null) {
    return (
      <div  style={{ margin: '15px' }}>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )}

  return (
    <div style={{ margin: '15px'}}>
      <div>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#" as="span">
                  <Link style={padding} to='/'>blogs</Link> 
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link style={padding} to='/users'>users</Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Notification />
          <div className="italics">{user.username} logged in 
            <h1 style={{ margin: ' 1px auto', textAlign: 'center',   color: 'darkgreen' }}><strong>blogs</strong></h1>
          </div>
        </div>
        <button data-testid="logout-button" onClick={handleLogout} className='btn btn-light'>logout</button>
      </div>
      <Routes>
        <Route path='/' element={<BlogsView blogs={blogs} user={user} />} />
        <Route path='/blogs' element={<BlogsView blogs={blogs} user={user} />} />
        <Route path='/blogs/:id' element={<BlogView blog={blog}  />} />
        <Route path='/users' element={<UsersView users={users} />}/>
        <Route path='/users/:id' element={<UsersBlogsView user={userChoice}/>}/>
      </Routes>
    </div>
  )
}


export default App