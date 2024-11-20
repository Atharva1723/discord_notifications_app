const axios = require('axios');

// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1308812609625002156/-xT_RMWfUdNDylCiUQbX_v2tFJhS1cTHMx04-Fwa6fbi4emTNu9tROD4g64IeSB-9Ahj';

// Netlify function handler
exports.handler = async function (event, context) {
  if (event.httpMethod === 'POST') {
    try {
      // Parse the incoming JSON body from GitLab webhook
      const body = JSON.parse(event.body);
      const { object_kind, commits, repository, user_name } = body;

      // Process only push events with commits
      if (object_kind === 'push' && commits) {
        for (const commit of commits) {
          const message = {
            content: null,
            embeds: [
              {
                title: `New Commit in ${repository.name}`,
                description: `**Message**: ${commit.message}\n**Author**: ${commit.author.name}\n**Branch**: ${body.ref.replace('refs/heads/', '')}\n**[View Commit](${commit.url})**`,
                color: 3066993, // Blue color
                timestamp: new Date(commit.timestamp),
                footer: {
                  text: `Committer: ${user_name}`,
                },
              },
            ],
          };

          // Send message to Discord via webhook
          await axios.post(DISCORD_WEBHOOK_URL, message);
        }
      }

      // Respond with a 200 status code on successful processing
      return {
        statusCode: 200,
        body: 'Webhook received!',
      };
    } catch (error) {
      console.error('Error handling webhook:', error.message);
      
      // Respond with a 500 status code on error
      return {
        statusCode: 500,
        body: 'Error processing webhook.',
      };
    }
  }

  // Respond with 405 if not a POST request
  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
