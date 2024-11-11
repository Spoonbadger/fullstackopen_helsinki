import { useState } from 'react'
import { useSelector } from 'react-redux'
import { deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Link } from 'react-router-dom'


const blogStyle = {
  paddingTop: 5,
  paddingLeft: 5,
  border: 'solid',
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


  // Delete own blog entry
  // const handleDelete = async (blogToGo) => {
  //   dispatch(deleteBlog(blogToGo))
  //   dispatch(setNotification({ message: `Post: "${blogToGo.title}" deleted`, type: 'error'}, 4.5))
  // }

  // See if the user is the blog poster (check incase the is no blog.user assigned to a post)
  const blogPoster = blog.user ?
    user.blogs.some(userBlog => userBlog.user === blog.user.id)
    : false


  return (
    <div>
      <div>
        <div className='blog-title-author' style={blogStyle}>
          <Link style={buttonStyle} to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      </div>
    </div>
  )
}

export default Blog