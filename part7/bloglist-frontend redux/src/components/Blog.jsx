import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'

const blogStyle = {
  paddingTop: 5,
  paddingLeft: 5,
  border: "solid",
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 5,
}
const buttonStyle = {
  margin: 5,
}

const Blog = ({ id, user }) => {
const blog = useSelector(state => state.blogs.find(b => b.id === id))

if (!blog) return null

  const [infoVisible, setInfoVisible] = useState(false)

  const hideWhenInfoVisible = { display: infoVisible ? "none" : "" }
  const showWhenInfoVisible = { display: infoVisible ? "" : "none" }

  const toggleVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  const dispatch = useDispatch()
  const handleLike = () => {
    const updatedBlog = {...blog, likes: blog.likes + 1 }
    dispatch(addLike(updatedBlog))
  }

  const handleDelete = (blog) => {
    dispatch(deleteBlog(blog))
  }

  // See if the user is the blog poster (check incase there is no blog.user assigned to a post)
  const blogPoster = blog && blog.user
    ? user.blogs?.some(userBlog => userBlog.user === blog.user.id)
    : false

  // const blogPoster = user?.blogs?.some((userBlog) => userBlog.user === blog?.user?.id);


  return (
    <div>
      <div style={hideWhenInfoVisible}>
        <div className="blog-title-author" style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility} style={buttonStyle}>
            view
          </button>
        </div>
      </div>
      <div style={showWhenInfoVisible}>
        <div className="expandedBlogView" style={blogStyle}>
          <div className="blog-title">
            {blog.title}
            <button onClick={toggleVisibility} style={buttonStyle}>
              hide
            </button>
          </div>
          <div data-testid="blog-url">{blog.url}</div>
          <div data-testid="blog-likes">
            likes: {blog.likes}
            <button
              data-testid="like-button"
              onClick={handleLike}
              style={buttonStyle}
            >
              like
            </button>
          </div>
          <div className="blog-author">{blog.author}</div>
          {blogPoster && (
            <button style={buttonStyle} onClick={() => handleDelete(blog)}>
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog