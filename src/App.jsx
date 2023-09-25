import { useState } from 'react';
import './App.css';
import {useJsonQuery} from './utilities/fetch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'bootstrap/dist/css/bootstrap.min.css';

const Banner = (props) =>(
  // <header className="App-header">
  <header>
  <h1>{props.name}</h1>
</header>
);

const CourseList = (props) => {
return (
  <div className="course-list justify-content-center">
  {props.courses.map((course, id) => (
  <div className="card m-1 p-2" style={props.selected.includes(id) ? {backgroundColor: "#BDEEBE"} : {backgroundColor:"white"}} onClick={() => props.toggleSelected(id)}>
    <p><h5>{course.term}</h5> <strong>CS {course.number}</strong>: {course.title}</p>
    <div className="card-footer mt-auto"><p><small><em>{course.meets}</em></small></p></div>
    </div>))}
  </div>
)
}

const QueryCourseList = (props) => {
  const [data, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');

  if (error) return <h1>Error loading user data: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading user data...</h1>;
  if (!data) return <h1>No user data found</h1>;

  return <div> 
    <Banner name={data.title} />
    <CourseList courses={Object.values(data.courses)} selected={props.selected} toggleSelected={props.toggleSelected} />
    </div>;
}

const queryClient = new QueryClient();

const App = () => {
  const [selected, setSelected] = useState([]);
  const toggleSelected = (item) => setSelected(
    selected.includes(item)
    ? selected.filter(x => x !== item)
    : [...selected, item]
  );
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App container">
    <QueryCourseList selected={selected} toggleSelected={toggleSelected}/>
    {/* <QueryCourseList /> */}
    </div>
    </QueryClientProvider>
  );
};

export default App;