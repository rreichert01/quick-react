import { useState } from 'react';
import './App.css';
import {useJsonQuery} from './utilities/fetch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'bootstrap/dist/css/bootstrap.min.css';

// // const schedule = {
// //   title: "CS Courses for 2023-2024",
// //   "courses": {
// //     "F101" : {
// //       "term": "Fall",
// //       "number": "101",
// //       "meets" : "MWF 11:00-11:50",
// //       "title" : "Computer Science: Concepts, Philosophy, and Connections"
// //     },
// //     "F110" : {
// //       "term": "Fall",
// //       "number": "110",
// //       "meets" : "MWF 10:00-10:50",
// //       "title" : "Intro Programming for non-majors"
// //     },
// //     "S313" : {
// //       "term": "Spring",
// //       "number": "313",
// //       "meets" : "TuTh 15:30-16:50",
// //       "title" : "Tangible Interaction Design and Learning"
// //     },
// //     "S314" : {
// //       "term": "Spring",
// //       "number": "314",
// //       "meets" : "TuTh 9:30-10:50",
// //       "title" : "Tech & Human Interaction"
// //     }
// //   }
// // }

const Banner = (props) =>(
  // <header className="App-header">
  <header>
  <h1>{props.name}</h1>
</header>
);

const CourseList = (props) => {
return (
  <div className="course-list justify-content-center">
  {props.courses.map(course => (
  <div className="card m-1 p-2">
    <p><h5>{course.term}</h5> <strong>CS {course.number}</strong>: {course.title}</p>
    <div className="card-footer mt-auto"><p><small><em>{course.meets}</em></small></p></div>
    </div>))}
  </div>
)
}

const QueryCourseList = () => {
  const [data, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');

  if (error) return <h1>Error loading user data: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading user data...</h1>;
  if (!data) return <h1>No user data found</h1>;

  return <div> 
    <Banner name={data.title} />
    <CourseList courses={Object.values(data.courses)} />
    </div>;
}

const queryClient = new QueryClient();

const App = () => {
  const [count, setCount] = useState(0);
  // console.log(schedule);
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App container">
    <QueryCourseList />
    </div>
    </QueryClientProvider>
  );
};

export default App;