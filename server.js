const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send all messages to the newly connected user
  socket.emit('init', messages);

  // Create
  socket.on('send-message', (msg) => {
    const message = { id: Date.now(), text: msg };
    messages.push(message);
    io.emit('message-added', message);
  });

  // Update
  socket.on('update-message', ({ id, newText }) => {
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      msg.text = newText;
      io.emit('message-updated', msg);
    }
  });

  // Delete
  socket.on('delete-message', (id) => {
    messages = messages.filter((m) => m.id !== id);
    io.emit('message-deleted', id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
