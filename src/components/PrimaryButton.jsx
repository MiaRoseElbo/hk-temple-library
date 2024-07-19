import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({ onClick, children, ...props }) => {
  return (
    <button className="primary-button" onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
