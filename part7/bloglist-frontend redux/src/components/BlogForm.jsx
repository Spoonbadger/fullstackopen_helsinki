import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {

  const dispatch = useDispatch()
  const titleRef = useRef()
  const authorRef = useRef()
  const urlRef = useRef()

  const addBlog = (event) => {
    event.preventDefault()

    const title = titleRef.current.value
    const author = authorRef.current.value
    const url = urlRef.current.value
    event.target.reset()
    dispatch(createBlog({ title, author, url }))
    dispatch(setNotification({
      message: `New blog posted: "${title}" by ${author}`, 
      type: 'success'
    }, 4.5))
    console.log("newpost:", title, author, url)
  }

  return (
    <div>
      <h3>create a new blog</h3>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            className="title"
            data-testid="title"
            ref = {titleRef}
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            className="author"
            data-testid="author"
            ref={authorRef}
            required
          />
        </div>
        <div>
          url:
          <input
            type="text"
            className="url"
            data-testid="url"
            ref={urlRef}
            required
          />
        </div>
        <button data-testid="create" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm
