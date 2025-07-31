import React, { useState, useEffect } from 'react';

const ResourceList = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Fetch initial resources
    fetch('http://localhost:8000/api/resources/')
      .then(response => response.json())
      .then(data => setResources(data));

    // In a real implementation, you would listen for resource updates via WebSocket
    // For simplicity, we'll skip that here
  }, []);

  return (
    <div className="list-container">
      <h3>Available Resources</h3>
      {resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        resources.map(resource => (
          <div key={resource.id} className={`list-item resource-${resource.status}`}>
            <h4>{resource.name}</h4>
            <p><strong>Type:</strong> {resource.type}</p>
            <p><strong>Status:</strong> {resource.status}</p>
            <p><strong>Capacity:</strong> {resource.current_load}/{resource.capacity}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ResourceList;
