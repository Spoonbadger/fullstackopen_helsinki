import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      window.localStorage.setItem("loggedInBlogUser", JSON.stringify(user))
      return action.payload
    },
    logoutUser(state, action) {
      window.localStorage.removeItem("loggedInBlogUser")
      return null
    }
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer
