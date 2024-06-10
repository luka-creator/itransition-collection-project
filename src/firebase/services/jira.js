import axios from 'axios';

const createJiraTicket = async (summary, priority, collectionName, link, userEmail) => {
  try {
    const authString = `${process.env.REACT_APP_JIRA_EMAIL}:${process.env.REACT_APP_JIRA_API_TOKEN}`;
    const base64AuthString = btoa(authString);

    const response = await axios.post(
      `https://${process.env.REACT_APP_JIRA_DOMAIN}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: process.env.REACT_APP_JIRA_PROJECT_KEY,
          },
          summary: summary,
          description: `Collection: ${collectionName}\nLink: ${link}`,
          issuetype: {
            name: 'Task',
          },
          priority: {
            name: priority,
          },
          reporter: {
            emailAddress: userEmail,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${base64AuthString}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Jira Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create Jira ticket');
  }
};

export { createJiraTicket };
