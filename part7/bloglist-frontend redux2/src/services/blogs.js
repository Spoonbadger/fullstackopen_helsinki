import axios from 'axios'
const baseUrl = '/api/blogs'
import tokenService from './token'


// let token = null
// const setToken = newToken => {
//   token = `Bearer ${newToken}`
// }

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


const create = async newObject => {
  const token = tokenService.getToken()
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


const addLike = async updatedBlog => {
  const token = tokenService.getToken()
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
    return response.data
  } catch(exception) {
    console.log("Error updating blog:", exception)
  }
}

const deleteBlog = async blogGone => {
  const token = tokenService.getToken()
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.delete(`${baseUrl}/${blogGone.id}`, config)
    return response.data
  } catch(exception) {
    console.log('Error deleting blog:', exception)
  }
}


// Get all comments
const getAllByBlogId = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

// Create a comment
const createComment = async ({ text, id }) => {
  const token = window.localStorage.getItem('token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios
    .post(`${baseUrl}/${id}/comments`, { text }, config)
  return response.data
}


export default { getAll, create, addLike, deleteBlog, createComment, getAllByBlogId }