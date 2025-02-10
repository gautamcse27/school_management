const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path  = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// PostgreSQL Connection

const pool = new Pool({
  user: 'school_user',
  host: 'localhost',
  database: 'school_management',
  password: 'school@321',
  port: 5432,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits:{
      fileSize: 5 * 1024 * 1024
  }
});

// Routes for Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM teachers');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route to add a teacher with a photo
app.post('/api/teachers', 
  upload.single('photo'), 
  async (req, res) => {
  const { name, email, phone, subjects, qualification } = req.body;
  const photoFile = req.file ? req.file.buffer : null;


  try {
    const { rows } = await pool.query(
      'INSERT INTO teachers (name, email, phone, subjects, qualification, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, subjects, qualification,
      photoFile ? photoFile.buffer.toString('base64') : null]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/api/teachers/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subjects, qualification } = req.body;
  const photoFile = req.file ? req.file.buffer : null;

  try {
    // Fetch existing teacher data
    const existingTeacher = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
    if (existingTeacher.rowCount === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const currentData = existingTeacher.rows[0];

    // Use existing values if no new data is provided
    const updatedName = name || currentData.name;
    const updatedEmail = email || currentData.email;
    const updatedPhone = phone || currentData.phone;
    const updatedSubjects = subjects || currentData.subjects;
    const updatedQualification = qualification || currentData.qualification;
    const updatedPhoto = photoFile || currentData.photo;

    // Update teacher data
    const { rows } = await pool.query(
      'UPDATE teachers SET name = $1, email = $2, phone = $3, subjects = $4, qualification = $5, photo = $6 WHERE id = $7 RETURNING *',
      [updatedName, updatedEmail, updatedPhone, updatedSubjects, updatedQualification, updatedPhoto, id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM teachers WHERE id = $1', [id]);
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes for Students
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route to add a student with a photo
app.post('/api/students', upload.single('photo'), async (req, res) => {
  const { name, phone, class: studentClass, performance, fee_details, transporting } = req.body;
  let photoBase64 = null;

  if (req.file) {
    photoBase64 = encodeFileToBase64(req.file.path);
    fs.unlinkSync(req.file.path); // Remove the temporary file
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO students (name, phone, class, performance, photo, fee_details, transporting) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, phone, studentClass, performance, photoBase64, fee_details, transporting]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, class: studentClass, performance, photo, fee_details, transporting } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE students SET name = $1, phone = $2, class = $3, performance = $4, photo = $5, fee_details = $6, transporting = $7 WHERE id = $8 RETURNING *',
      [name, phone, studentClass, performance, photo, fee_details, transporting, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
