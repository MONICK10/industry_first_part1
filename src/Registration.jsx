// src/RegistrationModal.jsx
import React, { useState } from "react";
import "./FactoryLayout.css";

const departmentOrder = ["Welding", "Assembly", "Painting", "Quality", "Packaging"];

export default function RegistrationModal({ onRegister, onClose }) {
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState({});

  const handleSkillChange = (skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = Object.keys(selectedSkills).filter(skill => selectedSkills[skill]);
    if (!name || skillsArray.length === 0) {
      alert("Please enter a name and select at least one skill.");
      return;
    }
    onRegister(name, skillsArray);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New Worker</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="worker-name">Worker Name</label>
            <input
              id="worker-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Suresh Kumar"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Claimed Skills</label>
            <div className="skills-checkboxes">
              {departmentOrder.map(skill => (
                <label key={skill} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!selectedSkills[skill]}
                    onChange={() => handleSkillChange(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Register & Train</button>
          </div>
        </form>
      </div>
    </div>
  );
}