import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { createNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
      return anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })
  anecdotes.sort((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    dispatch(vote(anecdote.id))
    dispatch(createNotification(`Registered vote for: ${anecdote.content}`))

    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList