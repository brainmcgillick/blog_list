import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = receivedToken => {
  token = `Bearer ${receivedToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async updatedBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return response.data
}

const deleteBlog = async blogToDelete => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blogToDelete.id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, deleteBlog }