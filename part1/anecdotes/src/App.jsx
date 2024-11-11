import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  

  const anecdotesCount = anecdotes.length
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotesCount))

  const voteArray = Array(anecdotesCount).fill(0)
  const [vote, setVote] = useState(voteArray)

  const handleVote = () => {
    const copy = [...vote]
    copy[selected] += 1
    setVote(copy)
    console.log(...copy)
  }

  // Show the most popular quote
  const maxVote = Math.max(...vote)
  const mostVoted = vote.indexOf(maxVote)
  console.log(mostVoted)

  return (
    <div>
      <h3>
        Anecdote of the day
      </h3>
      <div>
        {anecdotes[selected]}
      </div>
      <div>
        has {vote[selected]} votes
      </div>
      <div>
        <button onClick={ handleVote }>vote</button>
        <button onClick={() => { setSelected(Math.floor(Math.random() * anecdotes.length)) }} >next anecdote</button>
      </div>
      <h3>
        Anecdote with the most votes
      </h3>
      <div>
        {anecdotes[mostVoted]}
      </div>
    </div>
  )
}

export default App