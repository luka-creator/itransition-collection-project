import axios from 'axios';

const PROXY_SERVER_URL = "https://collectionapp-a928bf60f40f.herokuapp.com";

export const createJiraTicket = async (summary, priority, collectionName, link, userEmail) => {
  try {
    const response = await axios.post(`${PROXY_SERVER_URL}/create-jira-ticket`, {
      summary,
      priority,
      collectionName,
      link,
      userEmail,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    throw new Error('Failed to create Jira ticket');
  }
};