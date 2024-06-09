import axios from 'axios';

const JIRA_DOMAIN = process.env.REACT_APP_JIRA_DOMAIN;
const JIRA_EMAIL = process.env.REACT_APP_JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.REACT_APP_JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.REACT_APP_JIRA_PROJECT_KEY;

const createJiraTicket = async (summary, priority, reporterEmail, collection, link) => {
  const url = `https://${JIRA_DOMAIN}/rest/api/3/issue`;
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  const data = {
    fields: {
      project: {
        key: JIRA_PROJECT_KEY
      },
      summary: summary,
      description: `Reported by: ${reporterEmail}\nCollection: ${collection}\nLink: ${link}`,
      issuetype: {
        name: 'Task' // Adjust issue type as necessary
      },
      priority: {
        name: priority
      },
      reporter: {
        name: reporterEmail
      }
    }
  };

  const response = await axios.post(url, data, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });

  return response;
};

export { createJiraTicket };
