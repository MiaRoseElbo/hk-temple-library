import React from 'react';
import './SecondaryButton.css';

const SecondaryButton = ({ onClick, children, ...props }) => {
  return (
    <button className="secondary-button" onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default SecondaryButton;