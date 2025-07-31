import React, { useState, useEffect } from 'react';
import socket from '../services/socket';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Fetch initial incidents
    fetch('http://localhost:8000/api/incidents/')
      .then(response => response.json())
      .then(data => setIncidents(data));

    // Listen for real-time updates
    socket.on('incident_update', (data) => {
      setIncidents(prev => {
        const updated = prev.map(inc => inc.id === data.incident.id ? data.incident : inc);
        // If new incident, add to list
        if (!prev.some(inc => inc.id === data.incident.id)) {
          updated.push(data.incident);
        }
        return updated;
      });
    });

    return () => {
      socket.off('incident_update');
    };
  }, []);

  return (
    <div className="list-container">
      <h3>Recent Incidents</h3>
      {incidents.length === 0 ? (
        <p>No incidents reported</p>
      ) : (
        incidents.map(incident => (
          <div key={incident.id} className={`list-item severity-${incident.severity} status-${incident.status}`}>
            <h4>{incident.title}</h4>
            <p>{incident.description}</p>
            <p><strong>Severity:</strong> {incident.severity}</p>
            <p><strong>Status:</strong> {incident.status.replace('_', ' ')}</p>
            <p><strong>Reported:</strong> {new Date(incident.reported_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default IncidentList;
