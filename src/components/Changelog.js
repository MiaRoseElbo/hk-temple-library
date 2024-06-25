// src/components/Changelog.js
import React, { useState, useEffect } from 'react';
import './Changelog.css';

const parseChangelog = (content) => {
  const lines = content.split('\n');
  const versions = [];
  let currentVersion = null;

  lines.forEach(line => {
    const versionMatch = line.match(/^v\d+\.\d+\.\d+/);
    if (versionMatch) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      currentVersion = {
        version: versionMatch[0],
        changes: []
      };
    } else if (currentVersion && line.startsWith('*')) {
      currentVersion.changes.push(line.slice(2).trim());
    } else if (currentVersion && line.startsWith('    *')) {
      const lastChangeIndex = currentVersion.changes.length - 1;
      currentVersion.changes[lastChangeIndex] += ' ' + line.slice(6).trim();
    }
  });

  if (currentVersion) {
    versions.push(currentVersion);
  }

  return versions;
};

const Changelog = () => {
  const [changelogData, setChangelogData] = useState([]);

  useEffect(() => {
    fetch('/CHANGELOG.rst')
      .then(response => response.text())
      .then(data => {
        const parsedData = parseChangelog(data);
        setChangelogData(parsedData);
      })
      .catch(error => console.error('Error fetching changelog:', error));
  }, []);

  const latestVersion = changelogData[0];

  return (
    <div className="changelog">
      <p className='sub-title'>Últimos cambios (Versión {latestVersion?.version})</p>
      <p className='text'>
        <ul className='lista-cambios'>
        {latestVersion?.changes.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
      </p>
    </div>
  );
};

export default Changelog;