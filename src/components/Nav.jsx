import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <div>
    <ul>
      <Link to={'/'}>Station Map</Link>
      <Link to={'/trips'}>Trip Map</Link>
    </ul>
  </div>
);

export { Nav as default };
