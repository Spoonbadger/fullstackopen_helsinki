// import PropTypes from "prop-types"
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {

  const dispatch = useDispatch()
  const usernameRef = useRef()
  const passwordRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      blogService.setToken(user.token)
      dispatch(setNotification({
        message: `Welcome: ${username}`, 
        type: 'success'
      }, 4.5))
    } catch (error) {
      dispatch(setNotification({
        message: "Invalid credentials", 
        type: 'error'
      }, 4.5))
    }
    console.log('usernamepassword:', username, password)
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          name="username"
          data-testid="username"
          ref={usernameRef}
          required
        />
      </div>
      <div>
        password
        <input
          type="password"
          name="password"
          data-testid="password"
          ref={passwordRef}
          required
        />
      </div>
      <button data-testid="login" type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm


  // LoginForm.propTypes = {
  //   handleSubmit: PropTypes.func.isRequired,
  //   handleUsernameChange: PropTypes.func.isRequired,
  //   handlePasswordChange: PropTypes.func.isRequired,
  //   username: PropTypes.string.isRequired,
  //   password: PropTypes.string.isRequired,
  // }