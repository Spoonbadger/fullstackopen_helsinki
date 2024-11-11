import { createSlice } from "@reduxjs/toolkit"
import blogService from '../services/blogs'

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments(state, action) {
      console.log('action.payload for setComments:', action.payload)
      return action.payload
    },
    appendComments(state, action) {
      return state.concat(action.payload.comment)
    }
  }
})

export const { setComments, appendComments } = commentSlice.actions

export const initializeComments = (blogId) => {
    return async dispatch => {
      try {
        const comments = await blogService.getAllByBlogId(blogId)
        console.log('initializeComments:', comments)
        dispatch(setComments(comments))
      } catch (error) {
        console.log('initializeComments Error:', error.message)
      }
    }
  }


export const addComment = commentObj => {
  return async dispatch => {
    try {
      console.log('commentObjPREblogService', commentObj)
      const newComment = await blogService.createComment(commentObj)
      console.log('newComment.comment?:', newComment.comment)
      dispatch(appendComments(newComment))
    } catch (err) {
      console.log('error addComment:', err.message);
    }
  }
}


export default commentSlice.reducer