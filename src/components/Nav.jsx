import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/nav.scss';

const Nav = () => (
  <div className="nav">
    <ul>
      <li><Link to={'/'}>Station Map</Link></li>
      <li><Link to={'/trips'}>Trip Map</Link></li>
    </ul>
  </div>
);

export { Nav as default };
