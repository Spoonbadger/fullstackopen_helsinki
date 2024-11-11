import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


const addLike = async updatedBlog => {
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


export default { getAll, create, setToken, addLike, deleteBlog }