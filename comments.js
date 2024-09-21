// Create web server
// Run server
// Listen for requests
// Respond to requests

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/comments' && req.method === 'GET') {
    fs.readFile('./comments.json', 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('File not found');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      fs.readFile('./comments.json', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('File not found');
          res.end();
        } else {
          const comments = JSON.parse(data);
          const newComment = JSON.parse(body);
          comments.push(newComment);

          fs.writeFile('./comments.json', JSON.stringify(comments, null, 2), (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.write('Internal server error');
              res.end();
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify(newComment));
              res.end();
            }
          });
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Page not found');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});