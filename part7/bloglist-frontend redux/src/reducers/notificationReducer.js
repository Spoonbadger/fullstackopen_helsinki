import { createSlice, current } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: null,
    reducers: {
      createNotification(state, action) {
        return action.payload
      },
      clearNotification(state, action) {
        return null
      }
    }
})

export const { createNotification, clearNotification } = notificationSlice.actions


export const setNotification = (notification, duration) => {
  return dispatch => {
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, (duration * 1000))
  }
}

export default notificationSlice.reducer