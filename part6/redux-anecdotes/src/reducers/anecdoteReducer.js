import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    appendAnecdotes(state, action) {
      state.push(action.payload)
      // it think it should be return state.concat(action.payload) to keep it immutable
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})


export const { appendAnecdotes, setAnecdotes } = anecdoteSlice.actions

export const vote = anecdote => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.vote(anecdote)
    dispatch(setAnecdotes(anecdotes => 
      anecdotes.map(anecdote.id === votedAnecdote.id
      ? votedAnecdote: anecdote
    )))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}


export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export default anecdoteSlice.reducer