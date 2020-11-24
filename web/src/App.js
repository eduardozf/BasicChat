import { useEffect } from 'react';
import io from 'socket.io-client';

function App() {

  useEffect(() => {
    const socket = io('ws://localhost:3333');

    socket.on("world", message => {
      console.log(message);
    });

    setTimeout(() => {
      console.log('Executou timout');
      socket.emit('hello', {
        message: "Hello World"
      })
    }, 3000)
  }, [])

  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
