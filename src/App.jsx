import { useState } from 'react';
import './App.css';
import {useJsonQuery} from './utilities/fetch';
import {findConflict} from './utilities/findConflict';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'bootstrap/dist/css/bootstrap.min.css';

const Banner = (props) =>(
  <header>
  <h1>{props.name}</h1>
</header>
);

const CourseList = (props) => {
return (
  <div className="course-list justify-content-center">
  {props.courses.map((course, id) => course.term != props.termSelection ? null : (
  <div className="card m-1 p-2" style={props.selected.includes(id) ? {backgroundColor: "#BDEEBE"} : {backgroundColor:"white"}} onClick={() => props.toggleSelected(id)}>
    <p><h5>{course.term}</h5> <strong>CS {course.number}</strong>: {course.title}</p>
    <div className="card-footer mt-auto"><p><small><em>{course.meets}</em></small></p></div>
    </div>))}
  </div>
)
}

const TermButton = (props) => {
  return (<div className='col-4'>
  <input type="radio" id={props.term} className="btn-check" checked={props.term === props.selection} autoComplete="off"
    onChange={() => props.setSelection(props.term)} />
  <label className="btn btn-success mb-1 p-2" htmlFor={props.term}>
  { props.term }
  </label>
</div>)
};


const Modal = ({ children, open, close }) => (
  <div
    className={` modal ${open ? 'modal-show' : ''}`}
    tabIndex="-1"
    role="dialog"
    onClick={(evt) => { if (evt.target === evt.currentTarget) close(); }}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" aria-label="Close"
            onClick={close}
          />
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const SelectedCourses = ({selected, courses}) => (
  <div className="cart">
    {
      selected.length === 0
      ? (<div><h2>No Courses are Selected</h2> <p>Click on a course to add it to the list of selected courses</p></div>)
      : selected.map(courseId => (
          <p><strong>{courses[courseId].number}</strong> {courses[courseId].title}: <i>{courses[courseId].meets}</i></p>
        ))
    }
  </div>
);


const QueryCourseList = (props) => {
  const [data, isLoading, error] = useJsonQuery('https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php');

  if (error) return <h1>Error loading user data: {`${error}`}</h1>;
  if (isLoading) return <h1>Loading user data...</h1>;
  if (!data) return <h1>No user data found</h1>;

  return <div> 
    <Banner name={data.title} />
    <div style={{"display": "flex"}}>
    {["Fall", "Winter", "Spring"].map(term => (<TermButton term={term} selection={props.selection} setSelection={props.setSelection} />))}
    </div>
       {/* Copy - Paste */}
       <button className="btn btn-outline-dark col-3" onClick={props.openModal}><i className="bi bi-cart4">Show Selected Courses</i></button>
      <Modal open={props.open} close={props.closeModal}>
      <SelectedCourses selected={props.selected} courses={Object.values(data.courses)} />
      </Modal>
      {/* Copy - Paste */}
    <CourseList courses={Object.values(data.courses)} selected={props.selected} toggleSelected={props.toggleSelected} termSelection={props.selection}/>
    </div>;
}

const queryClient = new QueryClient();


const App = () => {
  const [selected, setSelected] = useState([]);
  const [selection, setSelection] = useState("Fall");
  const [open, setOpen] = useState(false);

  const openModal = () => {console.log("open window"); setOpen(true)};
  const closeModal = () => {console.log("close window"); setOpen(false)};
  const toggleSelected = (item) => setSelected(
    selected.includes(item)
    ? selected.filter(x => x !== item)
    : [...selected, item]
  );
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App container">
    <QueryCourseList open={open} openModal={openModal} closeModal={closeModal} selected={selected} toggleSelected={toggleSelected} selection={selection} setSelection={setSelection}/>
    {/* <QueryCourseList /> */}
    </div>
    </QueryClientProvider>
  );
};

export default App;