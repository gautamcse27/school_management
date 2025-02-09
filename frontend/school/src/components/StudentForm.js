import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentForm = () => {
  const { id } = useParams(); // Get the student ID from the URL (for editing)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    class: 1, // Default to class 1
    performance: '',
    photo: '',
    fee_details: { amount: 0, paid: false }, // Default fee details
    transporting: false, // Default to false
  });

  // Fetch student data if in edit mode
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/students/${id}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error('Error fetching student data:', error);
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

  // Handle fee details changes
  const handleFeeDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      fee_details: {
        ...formData.fee_details,
        [name]: name === 'amount' ? parseFloat(value) : value === 'true', // Convert amount to number and paid to boolean
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing student
        await axios.put(`http://localhost:8000/api/students/${id}`, formData);
      } else {
        // Add new student
        await axios.post('http://localhost:8000/api/students', formData);
      }
      navigate('/students'); // Redirect to the students list after submission
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Student' : 'Add Student'}</h2>
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
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Class:</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Performance:</label>
          <input
            type="text"
            name="performance"
            value={formData.performance}
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
        <div>
          <label>Fee Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.fee_details.amount}
            onChange={handleFeeDetailsChange}
          />
        </div>
        <div>
          <label>Fee Paid:</label>
          <select
            name="paid"
            value={formData.fee_details.paid.toString()} // Convert boolean to string
            onChange={handleFeeDetailsChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label>Transporting:</label>
          <select
            name="transporting"
            value={formData.transporting.toString()} // Convert boolean to string
            onChange={(e) =>
              setFormData({
                ...formData,
                transporting: e.target.value === 'true',
              })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button type="submit">{id ? 'Update' : 'Add'} Student</button>
      </form>
    </div>
  );
};

export default StudentForm;