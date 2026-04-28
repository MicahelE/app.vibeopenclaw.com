const http = require('http');
const port = process.env.AGENT_PORT || 18789;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    agent: process.env.AGENT_NAME || 'openclaw-agent',
    agent_id: process.env.AGENT_ID,
    type: 'openclaw',
    timestamp: new Date().toISOString(),
  }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`OpenClaw agent running on port ${port}`);
});
