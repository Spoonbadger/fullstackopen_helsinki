import { createSlice } from '@reduxjs/toolkit'


const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
      filterChange(state, action) {
        const searchInquiry = action.payload
        console.log("action payload:", action.payload)
        return searchInquiry
      }
    }
})


export const { filterChange } = filterSlice.actions
export default filterSlice.reducer