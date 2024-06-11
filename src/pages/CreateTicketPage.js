import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createJiraTicket } from '../firebase/services/jira';
import { useTranslation } from 'react-i18next';
import { useFirestore } from '../firebase/services/firestore';

const CreateTicketPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addTicket: addTicketToFirestore } = useFirestore(); 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user || !user.email) {
        setError(t('userNotAuthenticated'));
        setLoading(false);
        return;
      }

      const collectionName = location.state?.collectionName || 'N/A';
      const link = location.pathname;

      const jiraTicket = await createJiraTicket(summary, priority, collectionName, link, user.email);

      await addTicketToFirestore(user.uid, { 
        summary,
        priority,
        collectionName,
        link,
        jiraLink: `https://${process.env.REACT_APP_JIRA_DOMAIN}/browse/${jiraTicket.key}`,
        createdAt: new Date(), 
      });

    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(t('ticketCreationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{t('createTicket')}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="summary">{t('summary')}</label>
          <input
            type="text"
            className="form-control"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">{t('priority')}</label>
          <select
            className="form-control"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="High">{t('high')}</option>
            <option value="Medium">{t('medium')}</option>
            <option value="Low">{t('low')}</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('loading') : t('createTicket')}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketPage;