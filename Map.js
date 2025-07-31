import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import socket from '../services/socket';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl());

    // Fetch initial data
    fetch('http://localhost:8000/api/incidents/')
      .then(response => response.json())
      .then(data => {
        setIncidents(data);
        addMarkers(data, 'incident');
      });

    fetch('http://localhost:8000/api/resources/')
      .then(response => response.json())
      .then(data => {
        setResources(data);
        addMarkers(data, 'resource');
      });

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
      updateMarker(data.incident, 'incident');
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addMarkers = (items, type) => {
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = `marker ${type}`;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      
      if (type === 'incident') {
        switch (item.severity) {
          case 'low':
            el.style.backgroundColor = '#28a745';
            break;
          case 'medium':
            el.style.backgroundColor = '#ffc107';
            break;
          case 'high':
            el.style.backgroundColor = '#fd7e14';
            break;
          case 'critical':
            el.style.backgroundColor = '#dc3545';
            break;
          default:
            el.style.backgroundColor = '#007bff';
        }
      } else if (type === 'resource') {
        switch (item.status) {
          case 'available':
            el.style.backgroundColor = '#28a745';
            break;
          case 'assigned':
            el.style.backgroundColor = '#ffc107';
            break;
          case 'unavailable':
            el.style.backgroundColor = '#dc3545';
            break;
          default:
            el.style.backgroundColor = '#007bff';
        }
      }

      new mapboxgl.Marker(el)
        .setLngLat([item.location.coordinates[0], item.location.coordinates[1]])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${item.name || item.title}</h3><p>${item.description || ''}</p>`))
        .addTo(map.current);
    });
  };

  const updateMarker = (item, type) => {
    // In a real implementation, you would update the existing marker or remove and re-add
    // For simplicity, we'll just remove all markers and re-add them
    const markers = document.getElementsByClassName(`marker ${type}`);
    while (markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }
    
    if (type === 'incident') {
      addMarkers(incidents, type);
    } else {
      addMarkers(resources, type);
    }
  };

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
