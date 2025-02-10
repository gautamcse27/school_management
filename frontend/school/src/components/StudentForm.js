import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const StudentForm = () => {
  const [student, setStudent] = useState({
    name: '',
    phone: '',
    class: '',
    performance: '',
    photo: '', // Store Base64 string
    fee_details: { amount: '', paid: false },
    transporting: false,
  });

  const navigate = useNavigate();

  // Handle general input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  // Handle file selection and convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent((prevStudent) => ({
          ...prevStudent,
          photo: reader.result.split(',')[1], // Extract Base64 part
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle fee details change
  const handleFeeDetailsChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      fee_details: { ...prevStudent.fee_details, [name]: value },
    }));
  };

  const handleTransportingChange = (e) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      transporting: e.target.checked,
    }));
  };

  // Submit form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/students', student, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/students');
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h4>{student.id ? 'Edit Student' : 'Add New Student'}</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Student Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={student.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={student.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formClass">
                  <Form.Label>Class</Form.Label>
                  <Form.Control
                    as="select"
                    name="class"
                    value={student.class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        Class {i + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPerformance">
                  <Form.Label>Performance</Form.Label>
                  <Form.Control
                    type="text"
                    name="performance"
                    value={student.performance}
                    onChange={handleChange}
                    placeholder="Enter performance details"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoto">
                  <Form.Label>Upload Photo</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formFeeAmount">
                  <Form.Label>Fee Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={student.fee_details.amount}
                    onChange={handleFeeDetailsChange}
                    placeholder="Enter fee amount"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formFeePaid">
                  <Form.Check
                    type="checkbox"
                    label="Fee Paid"
                    name="paid"
                    checked={student.fee_details.paid}
                    onChange={(e) => handleFeeDetailsChange({ target: { name: 'paid', value: e.target.checked } })}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransporting">
                  <Form.Check
                    type="checkbox"
                    label="Transporting"
                    checked={student.transporting}
                    onChange={handleTransportingChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit">
                    {student.id ? 'Update Student' : 'Add Student'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/students')}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentForm;
