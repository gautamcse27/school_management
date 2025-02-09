import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TeacherForm = () => {
  const { id } = useParams(); // Get the teacher ID from the URL (for editing)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [],
    qualification: '',
    photo: '',
  });

  // Fetch teacher data if in edit mode
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/teachers/${id}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error('Error fetching teacher data:', error);
        });
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing teacher
        await axios.put(`http://localhost:8000/api/teachers/${id}`, formData);
      } else {
        // Add new teacher
        await axios.post('http://localhost:8000/api/teachers', formData);
      }
      navigate('/teachers'); // Redirect to the teachers list after submission
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Teacher' : 'Add Teacher'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Subjects (comma-separated):</label>
          <input
            type="text"
            name="subjects"
            value={formData.subjects.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjects: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </div>
        <div>
          <label>Qualification:</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Photo URL:</label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{id ? 'Update' : 'Add'} Teacher</button>
      </form>
    </div>
  );
};

export default TeacherForm;