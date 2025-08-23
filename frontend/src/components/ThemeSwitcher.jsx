import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Form from 'react-bootstrap/Form';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="d-flex align-items-center theme-switcher">
      <BsSunFill size={24} className="me-2" />
      <Form.Check 
        type="switch"
        id="theme-switch"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        aria-label="Alternar tema"
      />
      <BsMoonStarsFill size={20} className="ms-1"/>
    </div>
  );
}