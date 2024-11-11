import { Link, useParams } from "react-router-dom"
import { addLike } from '../reducers/blogReducer'
import { useDispatch, useSelector } from "react-redux"
import { addComment, initializeComments } from '../reducers/commentReducer'
import { useEffect } from "react"


const buttonStyle = {
    margin: 5,
  }


const BlogView = ({ blog }) => {
  const dispatch = useDispatch()

  console.log('blog:>>:', blog);

  if (!blog) return <div>Loading...</div>

  // Get the comments from Redux store
  const comments = useSelector(state => state.comments || [])
  console.log('comments??:', comments);

  // Get comments for this blog
  useEffect(() => {
    if (blog) {
      console.log('Blog ID:', blog.id)
      dispatch(initializeComments(blog.id))
    }
  }, [blog.id, dispatch])


  const handleLike = () => {
    const updatedBlog = {...blog, likes: blog.likes + 1}
    dispatch(addLike(updatedBlog))
  }


  const handleComment = (event) => {
    event.preventDefault()

    const text = event.target.comment.value
    const id = blog.id
    console.log('commentText,id:', text, id);
    dispatch(addComment({ text, id }))
    event.target.comment.value = ''
    dispatch(initializeComments(id))
  }

  const token = window.localStorage.getItem('token')
  console.log('Token retrieved:', token) // Check if token is correctly retrieved
  console.log('blog.user.id>>:', blog.user.id);


  return (
    <div>
        <h1>"{blog.title}" by {blog.author}</h1>
        <a href="{blog.url}">{blog.url}</a>
        <div>
            {blog.likes} likes <button className='btn btn-primary' data-testid='like-button' onClick={handleLike} style={buttonStyle}>like</button>
        </div>
        <div>
            added by <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
        </div>
        <div style={{marginTop: 25}}>
          <h4><strong>comments</strong></h4>
          <form onSubmit={handleComment}>
            <input name='comment' required />
            <button className='btn btn-success' type="submit">add comment</button>
          </form>
          <ul>
            {comments.map((comment, index) => (
              <li key={comment.id || index}>
                {comment.text}
              </li>
            )
            )}
          </ul>
        </div>
    </div>
  )
}

export default BlogView