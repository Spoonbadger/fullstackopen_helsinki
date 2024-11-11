import { useRef } from 'react'
import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'
import Blog from '../components/Blog'


const BlogsView = ({ blogs, user }) => {

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm />
    </Togglable>
  )

  return (
    <div>
      <div>
        {blogForm()}
      </div>
      <div className="blogs-list">
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            id={blog.id}
            user={user}
          />
        )}
      </div>
    </div>
    )
  }

export default BlogsView