const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name} you are {props.age} years old.</p>
    </div>
  )
}

const App = () => {
  const friends = [ 'Peter', 'Maya']
  return (
    <>
      <h1>Greetings</h1>
      <Hello name='George' age={5 + 3}/>
      <Hello name='Ruby' age={10}/>
      <Hello name={'dan'} age={10 + 1}/>
      <Footer />
      <p>{friends}</p>
    </>
  )
}

const Footer = () => {
  return (
    <div>
      This was a greeting app. Thank you.
    </div>
  )
}

export default App