import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../firebase/services/firestore';

const UserTicketsPage = () => {
  const { user } = useAuth();
  const { getUserTickets } = useFirestore();
  const [tickets, setTickets] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user) return; 
    setLoading(true);
    const { tickets: newTickets, lastDoc: newLastDoc } = await getUserTickets(user.uid, 10, lastDoc);
    setTickets(prevTickets => [...prevTickets, ...newTickets]);
    setLastDoc(newLastDoc);
    setLoading(false);
  }, [getUserTickets, user, lastDoc]); 
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (!user) {
    return <div>Please log in to see your tickets.</div>; 
  }

  return (
    <div>
      <h2>Your Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            <a href={ticket.jiraLink} target="_blank" rel="noopener noreferrer">{ticket.summary}</a> - {ticket.status}
          </li>
        ))}
      </ul>
      {loading ? <p>Loading...</p> : <button onClick={fetchTickets}>Load More</button>}
    </div>
  );
};

export default UserTicketsPage;