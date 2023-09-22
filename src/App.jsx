import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const schedule = {
  title: "CS Courses for 2023-2024",
  "courses": {
    "F101" : {
      "term": "Fall",
      "number": "101",
      "meets" : "MWF 11:00-11:50",
      "title" : "Computer Science: Concepts, Philosophy, and Connections"
    },
    "F110" : {
      "term": "Fall",
      "number": "110",
      "meets" : "MWF 10:00-10:50",
      "title" : "Intro Programming for non-majors"
    },
    "S313" : {
      "term": "Spring",
      "number": "313",
      "meets" : "TuTh 15:30-16:50",
      "title" : "Tangible Interaction Design and Learning"
    },
    "S314" : {
      "term": "Spring",
      "number": "314",
      "meets" : "TuTh 9:30-10:50",
      "title" : "Tech & Human Interaction"
    }
  }
}


const Banner = (props) =>(
  // <header className="App-header">
  <header>
  <h1>{props.name}</h1>
</header>
);

const CourseList = (props) => {
  Object.entries(props.courses).map(([_, info]) => console.log([info.term, info.number, info.title]))
return (
  <div>
  {Object.entries(props.courses).map(([_, info]) => <p>{info.term} CS {info.number}: {info.title}</p>)}
  </div>
)
}

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <Banner name={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
};

export default App;
