import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  // Fetch teachers from the backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  // Handle teacher deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher.id !== id)); // Remove the deleted teacher from the list
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <div>
      <h2>Teachers List</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/teachers/add')}>
        Add New Teacher
      </button>
      <button className="btn btn-secondary mb-3 ms-2" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subjects</th>
            <th>Qualification</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.phone}</td>
              <td>{teacher.subjects.join(', ')}</td>
              <td>{teacher.qualification}</td>
              <td>
                {teacher.photo && (
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                )}
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/teachers/edit/${teacher.id}`)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(teacher.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherList;