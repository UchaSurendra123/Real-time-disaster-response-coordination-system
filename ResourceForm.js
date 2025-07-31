import React, { useState } from 'react';

const ResourceForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'medical',
    status: 'available',
    capacity: 1,
    current_load: 0,
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
    
    const resourceData = {
      ...formData,
      location: {
        type: 'Point',
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      },
    };

    fetch('http://localhost:8000/api/resources/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    })
    .then(response => response.json())
    .then(data => {
      // In a real implementation, you would emit a resource update via WebSocket
      // For simplicity, we'll skip that here
      
      // Reset form
      setFormData({
        name: '',
        type: 'medical',
        status: 'available',
        capacity: 1,
        current_load: 0,
        latitude: '',
        longitude: '',
      });
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="form-container">
      <h3>Add New Resource</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="medical">Medical Team</option>
            <option value="fire">Fire Department</option>
            <option value="police">Police</option>
            <option value="evacuation">Evacuation Center</option>
            <option value="supply">Supply Drop</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="current_load">Current Load</label>
          <input
            type="number"
            id="current_load"
            name="current_load"
            value={formData.current_load}
            onChange={handleChange}
            min="0"
            required
          />
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
        <button type="submit" className="btn btn-primary">Add Resource</button>
      </form>
    </div>
  );
};

export default ResourceForm;
