import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: '',
    qualification: '',
    photo: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/teachers/${id}`)
        .then(response => setFormData({ ...response.data, subjects: response.data.subjects.join(', ') }))
        .catch(() => setErrorMessage('Error fetching teacher data.'));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('The uploaded file exceeds the maximum size of 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherData = {
      ...formData,
      subjects: formData.subjects.split(',').map((s) => s.trim()),
    };

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/teachers/${id}`, teacherData);
      } else {
        await axios.post('http://localhost:8000/api/teachers', teacherData);
      }
      navigate('/teachers');
    } catch (error) {
      if (error.response && error.response.status === 413) {
        setErrorMessage('The uploaded file is too large. Please use a smaller image.');
        
      } else if (error.response && error.response.status === 409) {
        setErrorMessage('The email address already exists. Please use a different email.');
      } else {
        setErrorMessage('An error occurred while saving the teacher. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h4>{id ? 'Edit Teacher' : 'Add Teacher'}</h4>
            </Card.Header>
            <Card.Body>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter teacher name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSubjects">
                  <Form.Label>Subjects (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleChange}
                    placeholder="Enter subjects"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formQualification">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Enter qualification details"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoto">
                  <Form.Label>Upload Photo</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">Maximum size 2 MB.</Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit">
                    {id ? 'Update Teacher' : 'Add Teacher'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/teachers')}>
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

export default TeacherForm;
