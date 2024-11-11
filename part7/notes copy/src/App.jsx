import { useEffect, useState } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('example test message')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const handleNewNote = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }


  const postNewNote = (event) => {
    event.preventDefault()

    const noteObj = {
      important: Math.random() < 0.5,
      content: newNote
    }

    noteService
      .create(noteObj)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const notesShowing = showAll ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const changedNote = { 
      ...note, 
      important: !note.important
    }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log("Error:", error)
        setNotes(notes.filter(n => n.id !== id))
      })
    }

  return (
    <div className="container">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll) }>
          show { showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesShowing.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>
      <form onSubmit={postNewNote}>
        <input onChange={ handleNewNote } value={newNote} />
        <button>save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App