import React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import './styles.css';

const CircularLoader = () => (
  <div className="loaderBackground">
    <CircularProgress
      className="loader"
      size={100}
    />
  </div>
);
export default CircularLoader;
