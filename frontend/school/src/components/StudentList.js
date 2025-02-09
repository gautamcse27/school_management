import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch students from the backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  // Handle student deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${id}`);
      setStudents(students.filter(student => student.id !== id)); // Remove the deleted student from the list
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div>
      <h2>Students List</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/students/add')}>Add New Student</button>
      <button className="btn btn-secondary mb-3 ms-2" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Class</th>
            <th>Performance</th>
            <th>Fee Details</th>
            <th>Transporting</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.phone}</td>
              <td>Class {student.class}</td>
              <td>{student.performance}</td>
              <td>
                Amount: {student.fee_details.amount}, Paid: {student.fee_details.paid ? 'Yes' : 'No'}
              </td>
              <td>{student.transporting ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/students/edit/${student.id}`)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;