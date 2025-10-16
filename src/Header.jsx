import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <h1>Factory Simulation</h1>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Virtual Industry
        </NavLink>
        <NavLink to="/hr" className={({ isActive }) => isActive ? 'active-link' : ''}>
          HR Dashboard
        </NavLink>
      </nav>
    </header>
  );
}