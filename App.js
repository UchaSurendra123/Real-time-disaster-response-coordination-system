import React from 'react';
import Map from './components/Map';
import IncidentForm from './components/IncidentForm';
import ResourceForm from './components/ResourceForm';
import IncidentList from './components/IncidentList';
import ResourceList from './components/ResourceList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Map />
      <div className="sidebar">
        <IncidentForm />
        <ResourceForm />
        <IncidentList />
        <ResourceList />
      </div>
    </div>
  );
}

export default App;
