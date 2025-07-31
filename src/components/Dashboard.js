import React from 'react';
import GraphThumbnail from './GraphThumbnail';
import './Dashboard.css';

function Dashboard({ graphs }) {
  return (
    <div className="dashboard">
      <div className="graph-grid">
        {graphs.map(graph => (
          <GraphThumbnail 
            key={graph.id} 
            graph={graph} 
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;