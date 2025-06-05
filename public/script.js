const socket = io();
const msgInput = document.getElementById('msgInput');
const messagesUl = document.getElementById('messages');

let localMessages = [];

function renderMessages() {
  messagesUl.innerHTML = '';
  localMessages.forEach((msg) => {
    const li = document.createElement('li');
    li.className = 'msg';
    li.innerHTML = `
      ${msg.text}
      <button onclick="editMessage(${msg.id})">Edit</button>
      <button onclick="deleteMessage(${msg.id})">Delete</button>
    `;
    messagesUl.appendChild(li);
  });
}

function sendMessage() {
  const text = msgInput.value.trim();
  if (text) {
    socket.emit('send-message', text);
    msgInput.value = '';
  }
}

function editMessage(id) {
  const newText = prompt('Edit your message:');
  if (newText) {
    socket.emit('update-message', { id, newText });
  }
}

function deleteMessage(id) {
  if (confirm('Delete this message?')) {
    socket.emit('delete-message', id);
  }
}

socket.on('init', (msgs) => {
  localMessages = msgs;
  renderMessages();
});

socket.on('message-added', (msg) => {
  localMessages.push(msg);
  renderMessages();
});

socket.on('message-updated', (updated) => {
  const index = localMessages.findIndex((m) => m.id === updated.id);
  if (index > -1) {
    localMessages[index] = updated;
    renderMessages();
  }
});

socket.on('message-deleted', (id) => {
  localMessages = localMessages.filter((m) => m.id !== id);
  renderMessages();
});
