const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

const servers = ['http://localhost:3000', 'http://localhost:3001'];
let current = 0;
const handler = async (req, res) => {
  const { method, url, headers, body } = req;
  const server = servers[current];

  current === servers.length - 1 ? (current = 0) : current++;
  try {
    // Requesting to underlying application server
    const response = await axios({
      url: `${server}${url}`,
      method: method,
      headers: headers,
      data: body,
    });
    // Send back the response data
    // from application server to client
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

app.get('/favicon.ico', (req, res) => res.sendFile('/favicon.ico'));

app.use((req, res) => {
  handler(req, res);
});

app.listen(8080, (err) => {
  err
    ? console.log('Failed to listen on port 8080')
    : console.log('Load balancer running on port 8080');
});
