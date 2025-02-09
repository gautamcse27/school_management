import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome to School Management System</h1>
      <p>Manage teachers and students efficiently with this system.</p>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Teachers</h5>
              <p className="card-text">View and manage teacher records.</p>
              <a href="/teachers" className="btn btn-primary">Go to Teachers</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Students</h5>
              <p className="card-text">View and manage student records.</p>
              <a href="/students" className="btn btn-primary">Go to Students</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;