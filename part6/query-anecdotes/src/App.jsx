import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'


const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const updateVoteMutation = useMutation({
    mutationFn: updateVote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries('anecdotes')
      notificationDispatch({ type: 'newVote', anecdote: anecdote.content})
      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 5000)
    },
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }
  else if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
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

export default App
