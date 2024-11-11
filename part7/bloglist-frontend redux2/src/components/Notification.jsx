import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'


const Notification = () => {
  const notification = useSelector(state => state.notifications)

  if (!notification) {
    return null
  }
  const { message, type } = notification

  if (type === 'success') {
    return (
      <div data-testid="notification">
        <Alert variant="success">
          {message}
        </Alert>
      </div>
    )
  }
  if (type === 'error') {
    return (
      <div data-testid="notification">
        <Alert variant="danger">
          {message}
        </Alert>
      </div>
    )
  }
}

export default Notification