const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = ({ course }) => <h1>{course.name}</h1>
  
  
  const Part = ({ part }) => 
    <p >
      {part.name} {part.exercises}
    </p>
  
  const Content = ({ parts }) => 
    <>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}   
    </>
  
  const Total = ({ parts }) => {
    const sum = parts.reduce((s, p) => s + p.exercises, 0)
    return (
      <h4>Number of exercises {sum}</h4>
    )
  }

  export default Course