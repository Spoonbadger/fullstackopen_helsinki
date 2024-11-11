import { Link, useParams } from "react-router-dom"


const UserBlogsView = ({ user }) => {
  console.log('user:>>:', user);

  if (!user) return null

  return (
    <div>
      <h2>{user.username}</h2>
      <div>
        <strong>added blogs</strong>
      </div>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserBlogsView