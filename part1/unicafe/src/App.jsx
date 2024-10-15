import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all ? (good - bad) / all : 0
  const positive = all ? (good / all) * 100 :0

  if (all === 0) {
    return (
      <div>
        <h3>
          give feedback
        </h3>
        <Button text='good' handleClick={() => setGood(good + 1)}/>
        <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
        <Button text='bad' handleClick={() => setBad(bad + 1)}/>
        <h3>
          statistics
        </h3>
        <div>
          No feedback given
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3>
        give feedback
      </h3>
      <Button text='good' handleClick={() => setGood(good + 1)}/>
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
      <Button text='bad' handleClick={() => setBad(bad + 1)}/>
      <h3>
        statistics
      </h3>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
      
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const Statistics = (props) => {
  return (
    <table>
      <tbody>
        <StatisticLine text='good' stat={props.good} />
        <StatisticLine text='neutral' stat={props.neutral} />
        <StatisticLine text='bad' stat={props.bad} />
        <StatisticLine text='all' stat={props.all} />
        <StatisticLine text='average' stat={props.average} />
        <StatisticLine text='positive' stat={props.positive} />
        </tbody>
    </table>
  )
}

const StatisticLine = ({text, stat}) => {

  return (
    <tr>
      <td>{text}</td><td>{text === 'positive' ? `${stat}%` : stat}</td>
    </tr>
  )
}



export default App