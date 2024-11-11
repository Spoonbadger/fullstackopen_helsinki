import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog ({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })
    setNewBlog({ title: '', author: '', url: '' })
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
            value={newBlog.title}
            onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            className="author"
            data-testid="author"
            value={newBlog.author}
            onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
            required
          />
        </div>
        <div>
          url:
          <input
            type="text"
            className="url"
            data-testid="url"
            value={newBlog.url}
            onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
            required
          />
        </div>
        <button data-testid="create" type="submit">create</button>
      </form>
    </div>
  )
}


export default BlogForm