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

io.on("connection", socket => {
  console.log('New Connection', socket.id);

  socket.on("hello", message => {
    console.log(message);
  });

  setTimeout(() => {
    socket.emit('world', {
      message: "Hello Front"
    })
  }, 7000)
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