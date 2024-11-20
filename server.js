const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
 
const app = express();
const PORT = 3000;
// https://discord.com/api/webhooks/1308812609625002156/-xT_RMWfUdNDylCiUQbX_v2tFJhS1cTHMx04-Fwa6fbi4emTNu9tROD4g64IeSB-9Ahj
// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1308812609625002156/-xT_RMWfUdNDylCiUQbX_v2tFJhS1cTHMx04-Fwa6fbi4emTNu9tROD4g64IeSB-9Ahj';
 
// Middleware to parse JSON bodies
app.use(bodyParser.json());
 
// Endpoint to receive GitLab webhook
app.post('/gitlab-webhook', async (req, res) => {
try {
const { object_kind, commits, repository, user_name } = req.body;
console.log("COMMITED->", commits)
if (object_kind === 'push' && commits) {
for (const commit of commits) {
const message = {
content: null,
embeds: [
{
title: `New Commit in ${repository.name}`,
description: `**Message**: ${commit.message}\n**Author**: ${commit.author.name}\n**Branch**: ${req.body.ref.replace('refs/heads/', '')}\n**[View Commit](${commit.url})**`,
color: 3066993, // Blue color
timestamp: new Date(commit.timestamp),
footer: {
text: `Committer: ${user_name}`,
},
},
],
};
console.log(message)
// Send message to Discord
await axios.post(DISCORD_WEBHOOK_URL, message);
}
}
 
res.status(200).send('Webhook received!');
} catch (error) {
console.error('Error handling webhook:', error.message);
res.status(500).send('Error processing webhook.');
}
});
 
// Start the server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});