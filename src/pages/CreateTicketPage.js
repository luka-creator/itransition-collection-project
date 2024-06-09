import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../firebase/services/firestore';
import { createJiraTicket } from '../firebase/services/jira'; // Correct import path

const CreateTicketPage = () => {
  const { user } = useAuth();
  const { addTicket } = useFirestore();
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Low');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const collection = ''; // Set the collection name if applicable
      const link = window.location.href; // The current page URL
      const jiraResponse = await createJiraTicket(summary, priority, user.email, collection, link);

      await addTicket({
        userId: user.uid,
        summary,
        priority,
        status: 'Opened',
        jiraLink: jiraResponse.data.self,
      });

      // Optionally, you can clear the form after submission
      setSummary('');
      setPriority('Low');
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Create a Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Summary</label>
          <input 
            type="text" 
            value={summary} 
            onChange={(e) => setSummary(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Priority</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)} 
            required
          >
            <option value="High">High</option>
            <option value="Average">Average</option>
            <option value="Low">Low</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketPage;
