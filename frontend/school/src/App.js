import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TeacherList from './components/TeacherList';
import TeacherForm from './components/TeacherForm';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/teachers/add" element={<TeacherForm />} />
          <Route path="/teachers/edit/:id" element={<TeacherForm />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;