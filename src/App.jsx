import { useState } from 'react';
import './App.css';
import { useJsonQuery } from './utilities/fetch';
import { useDbData, useDbUpdate } from './utilities/firebase';
import { findConflict, timeToNum } from './utilities/findConflict';
import { useFormData } from './utilities/validateForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useParams, Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Banner = (props) => (
  <header>
    <h1>{props.name}</h1>
  </header>
);

const boolConflict = (selected, courses, course, id) => selected.map((elem) => selected.includes(id) ? false : findConflict(courses[elem], course)).reduce((acc, cur) => acc || cur, false)

const displayConflict = (selected, courses, id, course) => {

  if (selected.includes(id)) {
    return { backgroundColor: "#BDEEBE" }
  } else if (boolConflict(selected, courses, course, id)) {
    return { backgroundColor: "#f2a0a0" }
  }
  return { backgroundColor: "white" }
}


const CourseList = (props) => {
  return (
    <div className="course-list justify-content-center">
      {props.courses.map((course, id) => course.term != props.termSelection ? null : (
        <div className="card m-1 p-2" style={displayConflict(props.selected, props.courses, id, course)} onClick={() => boolConflict(props.selected, props.courses, course, id) ? null : props.toggleSelected(id)}>
          <p><h5>{course.term}</h5> <strong>CS {course.number}</strong>: {course.title}</p>
          <div className="card-footer mt-auto"><p><small><em>{course.meets}</em></small></p>
            <Link to={{ pathname: `/courseform/${id}`, state: { course } }}> EDIT </Link> </div>
        </div>))}
    </div>
  )
}

const TermButton = (props) => {
  return (<div className='col-4'>
    <input type="radio" id={props.term} className="btn-check" checked={props.term === props.selection} autoComplete="off"
      onChange={() => props.setSelection(props.term)} />
    <label className="btn btn-success mb-1 p-2" htmlFor={props.term}>
      {props.term}
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

const SelectedCourses = ({ selected, courses }) => (
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
  return <div>
    <div style={{ "display": "flex" }}>
      {["Fall", "Winter", "Spring"].map(term => (<TermButton term={term} selection={props.selection} setSelection={props.setSelection} />))}
    </div>
    <button className="btn btn-outline-dark col-3" onClick={props.openModal}><i className="bi bi-cart4">Show Selected Courses</i></button>
    <Modal open={props.open} close={props.closeModal}>
      <SelectedCourses selected={props.selected} courses={Object.values(props.data.courses)} />
    </Modal>
    <CourseList courses={Object.values(props.data.courses)} selected={props.selected} toggleSelected={props.toggleSelected} termSelection={props.selection} />
  </div>;
}

const validateUserData = (key, val) => {
  switch (key) {
    case 'title':
      return /(^\w\w)/.test(val) ? '' : 'must be least two characters';
    case 'meets':
      const time_regex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
      let [days, time] = val.split(" ");
      [days, time] = [days.split(/(?=[A-Z])/), time.split("-")];
      let valid = time.map(elem => time_regex.test(elem)).reduce((acc, cur) => acc || cur, false)
      valid &= (timeToNum(time[1]) - timeToNum(time[0])) > 0;
      valid &= days.map(day => ["M", "Tu", "W", "Th", "F"].includes(day)).reduce((acc, cur) => acc || cur, false)
      return valid ? '' :  "must contain days and a valid start-end, e.g., MWF 12:00-13:20";
    default: return '';
  }
};

const InputField = ({ name, text, state, change }) => {
  return (<div className="mb-3">
    {/* <label htmlFor={name} className="form-label">{text}</label>
    <input className="form-control" id={name} name={name} 
      defaultValue={state.values?.[name]} onChange={change} /> */}
    <label htmlFor={name} className="col-sm-2 col-form-label">{text}</label>
    <input className="form-control" name={name} id={name} defaultValue={state.values?.[name]} onChange={change} />
    <div className="invalid-feedback">{state.errors?.[name]}</div>
  </div>
)};

const EditForm = (props) => {
  
  let { id } = useParams();
  let course = props.courses[parseInt(id)]
  const [state, change] = useFormData(validateUserData, course);
  let path = `/courses/${course.term[0]}${course.number}`
  const [updateData, result] = useDbUpdate(path);
  console.log(path)
  const navigate = useNavigate();
  const submit = (evt) => {
    evt.preventDefault();
    if (!state.errors) {
      updateData({
        title: state.values.title,
        meets: state.values.meets
      })
      navigate('/');
    }
  };
  return <div className="border border-success rounded">
    <form onSubmit={submit} noValidate className={`p-4 form-inline ${state.errors ? 'was-validated' : ""}`}>
      <h3>Edit Course</h3>
      <InputField name="title" text="Course Title" state={state} change={change} />
      {/* <label htmlFor='title' className="col-sm-2 col-form-label">Course Title</label>
      <input className="form-control" name='title' defaultValue={course.title} /> */}
      <InputField name="meets" text="Meeting Time" state={state} change={change} />
      {/* <label htmlFor='meets' className="col-sm-2 col-form-label">Meeting Time</label>
      <input className="form-control" name='meets' defaultValue={course.meets} /> */}

      <Link to='/'>
        <button type="button" className="btn-outline-danger btn">Cancel Edit</button>
      </Link>
      <button type="submit" className="btn btn-outline-primary">Submit</button>

    </form>
  </div>
}

const Router = (props) => {
  const [data, error] = useDbData('/');

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  return (<div>
    <Banner name={data.title} />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<QueryCourseList data={data} open={props.open} openModal={props.openModal} closeModal={props.closeModal} selected={props.selected} toggleSelected={props.toggleSelected} selection={props.selection} setSelection={props.setSelection} />} />
        <Route path="courseform/:id" element={<EditForm courses={Object.values(data.courses)} />} />
      </Routes>
    </BrowserRouter>
  </div>)
}

const queryClient = new QueryClient();


const App = () => {
  const [selected, setSelected] = useState([]);
  const [selection, setSelection] = useState("Fall");
  const [open, setOpen] = useState(false);

  const openModal = () => { console.log("open window"); setOpen(true) };
  const closeModal = () => { console.log("close window"); setOpen(false) };
  const toggleSelected = (item) => setSelected(
    selected.includes(item)
      ? selected.filter(x => x !== item)
      : [...selected, item]
  );
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App container">
        <Router open={open} openModal={openModal} closeModal={closeModal} selected={selected} toggleSelected={toggleSelected} selection={selection} setSelection={setSelection} />
      </div>
    </QueryClientProvider>
  );
};

export default App;