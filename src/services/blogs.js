import axios from 'axios'
const baseUrl = '/api/blogs'
const loginUrl = "/api/login"

let token = null;

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
}

const login = async info => {
  const request = axios.post(loginUrl, info);
  const response = await request;
  return response.data;
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const createBlog = async newObj => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObj, config);
  return response.data;
}

const deleteBlog = async(id) => {
  const config = {
    headers: { Authorization: token }
  }
  try {
    await axios.delete(`${baseUrl}/${id}`, config);
  } catch(err) {
    console.error(err)
  }
}

export default { getAll, login, setToken, createBlog, deleteBlog }