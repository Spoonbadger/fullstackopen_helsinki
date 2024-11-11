import axios from 'axios'

const baseUrl = 'http://localhost:3003/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (anecdote) => {
    const object = { anecdote, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const vote = async (annecdote) => {
    const votedAnecdote = {
        ...annecdote,
        votes: annecdote.votes + 1
    }
    const response = await axios.put(`${baseUrl}/${annecdote.id}`, votedAnecdote)
    return response.data
} 

export default {
  getAll,
  createNew,
  vote
}