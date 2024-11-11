// import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useRef } from 'react'
import { setUser } from '../reducers/userReducer'
import loginService from '../services/login'
import tokenService from '../services/token'
import { setNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'


const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const usernameRef = useRef()
  const passwordRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = usernameRef.current.value
    const password = passwordRef.current.value
    console.log('HandlingLogin with...', username, password)

    try {
      const user = await loginService.login({ username, password })
      if (!user) {
        console.log('no user :( ):', user)
      }
      console.log('userinfo:', user)
      tokenService.setToken(user.token)
      dispatch(setUser(user))
      navigate('/')
      dispatch(setNotification({ message: `Welcome, ${username}`, type: 'success'}, 4.5))
    } catch (error) {
      console.log("Error logging in:", error.message)
    }
  }

  return (
    <div>
      <Form onSubmit={handleLogin} style={{ margin: '15px auto', maxWidth: '500px' }}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            data-testid="username"
            ref={usernameRef}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              data-testid="password"
              ref={passwordRef}
              required
            />
        </Form.Group>
        <Button data-testid="login" type="submit" variant="primary">login</Button>
      </Form>
    </div>
  )
}

export default LoginForm


// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }