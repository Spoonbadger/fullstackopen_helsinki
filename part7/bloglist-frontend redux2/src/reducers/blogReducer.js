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
    try { const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes) 
    dispatch(setBlogs(blogs))
    } catch (error) {
      console.log("Error on initializeBlogs:", error.message)
    }
  }
}

export const createBlog = blogFormInfo => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogFormInfo)
      dispatch(appendBlogs(newBlog))
    } catch (error) {
      console.log("Error in createBlog:", error.message)
    }
  }
}

export const addLike = likedBlog => {
  return async (dispatch, getState) => {
    try {
      const updatedBlog = await blogService.addLike(likedBlog)
      const blogs = getState().blogs
      const updatedBlogs = blogs.map(blog =>
        blog.id === likedBlog.id ? updatedBlog : blog
      ).sort((a, b) => b.likes - a.likes)
      dispatch(setBlogs(updatedBlogs))
    } catch (error) {
      console.log("Error in addLike:", error.message)
    }
  }
}

export const deleteBlog = blogToGo => {
  return async (dispatch, getState) => {
    if (window.confirm(`delete this blog ${blogToGo.title}?`)) {
      try {
        await blogService.deleteBlog(blogToGo)
        const blogs = getState().blogs
        const updatedBlogs = blogs.filter(blog =>
          blog.id !== blogToGo.id)
        dispatch(setBlogs(updatedBlogs))
      } catch (error) {
        console.log("Error in 'deleteBlog':", error.message)
      }
    }
  }
}




export default blogSlice.reducer