import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'


const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlogs(state, action) {
      return state.concat(action.payload)
    }
  }
})

export const { setBlogs, appendBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlogs(newBlog))
  }
}

export const addLike = (likedBlog) => {
  return async (dispatch, getState) => {
    const addedLikeBlog = await blogService.addLike(likedBlog)
    const blogs = getState().blogs
    const updatedBlogs = blogs.map(blog => 
      blog.id === likedBlog.id ? addedLikeBlog : blog
    ).sort((a, b) => b.likes - a.likes)

    dispatch(setBlogs(updatedBlogs))
  }
}


export const deleteBlog = (blogToGo) => {
  return async (dispatch, getState) => {
    if (window.confirm(`delete this blog ${blogToGo.title}?`)) {
      await blogService.deleteBlog(blogToGo)
      const blogs = getState().blogs
      const updatedBlogs = blogs.filter(blog => blog.id !== blogToGo.id)
      dispatch(setBlogs(updatedBlogs))
    }
  }
}

export default blogSlice.reducer