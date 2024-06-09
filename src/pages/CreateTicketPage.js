// src/pages/CreateTicketPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createJiraTicket } from '../firebase/services/jira';
import { useFirestore } from '../firebase/services/firestore';

const CreateTicketPage = () => {
  const { user } = useAuth();
  const { addTicket } = useFirestore();
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const collectionName = ''; // Set this based on your context
      const link = window.location.href;

      const jiraResponse = await createJiraTicket(summary, priority, collectionName, link, user.email);
      await addTicket({
        summary,
        priority,
        collectionName,
        link,
        status: 'Opened',
        userId: user.uid,
        jiraLink: `https://${process.env.REACT_APP_JIRA_DOMAIN}/browse/${jiraResponse.key}`,
        createdAt: new Date(),
      });

      setSuccess('Ticket created successfully');
      setSummary('');
      setPriority('Medium');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Create Ticket</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Summary</label>
          <input
            type="text"
            className="form-control"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Ticket</button>
      </form>
    </div>
  );
};
export default CreateTicketPage;
