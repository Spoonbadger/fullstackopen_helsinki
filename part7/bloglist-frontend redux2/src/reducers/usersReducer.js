import { createSlice } from "@reduxjs/toolkit"
import usersService from '../services/users'


const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

export const getAllUsers = () => {
  return async dispatch => {
    try {
        const users = await usersService.getAllUsers()
    dispatch(setUsers(users))
    } catch (error) {
      console.log('Error with setUsers:', error.message);
    }
  }
}

export default usersSlice.reducer