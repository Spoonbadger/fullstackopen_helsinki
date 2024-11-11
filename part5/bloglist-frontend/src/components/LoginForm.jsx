import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
      username
        <input
          type="text"
          name="username"
          data-testid="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </div>
      <div>
        password
        <input
          type="password"
          name="password"
          data-testid="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <button data-testid="login" type="submit">login</button>
    </form>
  )
}

export default LoginForm