import React, { useState } from 'react';
import socket from '../services/socket';

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const incidentData = {
      ...formData,
      location: {
        type: 'Point',
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      },
    };

    fetch('http://localhost:8000/api/incidents/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    })
    .then(response => response.json())
    .then(data => {
      // Emit the incident update via WebSocket
      socket.emit('incident_update', {
        type: 'incident_update',
        incident_id: data.id,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        latitude: '',
        longitude: '',
      });
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="form-container">
      <h3>Report New Incident</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Report Incident</button>
      </form>
    </div>
  );
};

export default IncidentForm;
