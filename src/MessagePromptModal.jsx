// src/MessagePromptModal.jsx
import React, { useState } from 'react';
import './FactoryLayout.css';

export default function MessagePromptModal({ worker, onSend, onClose, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(worker, message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Send Message to AI</h2>
        <p>Worker: <strong>{worker.name}</strong> ({worker.skillStatus})</p>
        <div className="form-group">
          <label htmlFor="ai-message">Describe the situation:</label>
          <textarea
            id="ai-message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Urgent call from home, must leave now."
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'AI is Thinking...' : 'Send to AI'}
          </button>
        </div>
      </div>
    </div>
  );
}