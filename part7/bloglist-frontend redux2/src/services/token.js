let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getToken = () => token


export default { setToken, getToken }


