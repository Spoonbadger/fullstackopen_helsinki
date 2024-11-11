import { useDispatch } from 'react-redux'
import { useRef } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  // set refs before addBlog
  const titleRef = useRef()
  const authorRef = useRef()
  const urlRef = useRef()

  const dispatch = useDispatch()

  // Add a blog
  const addBlog = (event) => {
    event.preventDefault()
    const title = titleRef.current.value
    const author = authorRef.current.value
    const url = urlRef.current.value
    try {
      dispatch(createBlog({ title, author, url, isOwner: true }))
      event.target.reset()
      dispatch(setNotification({ message: `New blog: ${title} by ${author} added`, type:'success' }, 4.5))
    } catch (error) {
      dispatch(setNotification({ message: 'failed to add new blog', type:'error' }, 4.5))
      console.log("Error adding blog:", error.message)
    }
  }

  return (
    <div>
      <h3>create a new blog</h3>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            className="title"
            data-testid="title"
            ref={titleRef}
            required
            style={{ maxWidth: '300px' }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            className="author"
            data-testid="author"
            ref={authorRef}
            required
            style={{ maxWidth: '300px' }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            className="url"
            data-testid="url"
            ref={urlRef}
            required
            style={{ maxWidth: '300px' }}
          />
        </Form.Group>
        <Button className='btn btn-warning' data-testid="create" type="submit">create</Button>
      </Form>
    </div>
  )
}


export default BlogForm