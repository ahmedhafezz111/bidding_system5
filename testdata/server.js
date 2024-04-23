// server.js
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set up json-server for product data
const jsonServer = require('json-server');
const router = jsonServer.router(path.join(__dirname,'testdata', 'db.json'));
const middlewares = jsonServer.defaults();

// Use json-server middlewares
app.use(middlewares);
app.use('/api', router);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for bid events
  socket.on('bid', (data) => {
    console.log('Bid received:', data);
    // Broadcast the new bid to all connected clients
    io.emit('newBid', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
