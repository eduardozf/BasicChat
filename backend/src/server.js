const express = require('express');
const cors = require('cors');

const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
})

let connectedUsers = [];
let allMessages = [];

function MessageToUsers(owner, message) {
  connectedUsers.forEach(socket => {
    if (socket.id === owner.id) return;
    socket.emit('message', message);
  });
}

io.on("connection", socket => {
  //On Socket Connect
  connectedUsers.push(socket);
  socket.emit('sync', allMessages);
  console.log('⭐ New Connection', socket.id);

  // On Recive Message
  socket.on("message", message => {
    allMessages.push(message)
    if (!(message.content.trim().length > 1)) return;
    MessageToUsers(socket, message)

    console.log('✉️  New message from', socket.id);
  });

  // On Socket Disconnect
  socket.on('disconnecting', () => {
    connectedUsers = connectedUsers.filter(user => !(user.id === socket.id));
    console.log(`⛔ User ${socket.id} disconnected`);
  });
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.json('test')
})

server.listen(3333, () => {
  console.clear();
  console.log('✅ Server running on port 3333')
})