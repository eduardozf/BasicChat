import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import './styles.css';

const initialUserNum = new Date().getTime().toString();

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      user: { name: "João", avatar: "https://api.hello-avatar.com/adorables/140/Joao" },
      content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
    },
    {
      user: { name: "Fulano", avatar: "https://api.hello-avatar.com/adorables/140/Fulano" },
      content: "maecenas pharetra convallis posuere morbi"
    },
    {
      user: { name: "João", avatar: "https://api.hello-avatar.com/adorables/140/Joao" },
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sit amet venenatis urna. Quam id leo in vitae turpis massa. In aliquam sem fringilla ut morbi."
    },
  ]);
  const [socket, setSocket] = useState();
  const [myUser, setMyUser] = useState(
    { name: `User${initialUserNum}`, avatar: `https://api.hello-avatar.com/adorables/140/${initialUserNum}` }
  );
  const TextRef = useRef();
  const UserInputRef = useRef();

  //Connect to WebSocket
  useEffect(() => {
    setSocket(io('ws://192.168.15.44:3333'));
  }, [])

  //Message Recived
  useEffect(() => {
    if (!socket) return;
    socket.on("message", newMessage => {
      console.log(newMessage);
      setMessages(oldMessages => [...oldMessages, newMessage])
    });


  }, [socket])

  function ShowLocalMessage() {
    const newMessage = { user: myUser, content: TextRef.current.value }
    setMessages(oldMessages => [...oldMessages, newMessage])
  }

  function HandleSend(e) {
    e.preventDefault();
    if (!socket || !TextRef) return;

    socket.emit('message', {
      user: myUser,
      content: TextRef.current.value
    });

    ShowLocalMessage()
  }

  function HandleChangeName() {
    if (UserInputRef.current.value.length <= 3 || UserInputRef.current.value.length > 12) {
      return alert("Usuário deve conter entre 4 e 12 caracteres");
    }
    setMyUser({ name: UserInputRef.current.value, avatar: `https://api.hello-avatar.com/adorables/140/${UserInputRef.current.value}` })
  }

  return (
    <div className="Container">
      <div className="Messages">
        {socket && console.log(`Socket`, socket)}
        {messages.map(message => (
          <div className="MessageBox">
            <div className="User">
              <img src={message.user.avatar} alt="Profile" />
              <span>{message.user.name}</span>
            </div>
            <div className="Message">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form className="TextInput" onSubmit={(e) => HandleSend(e)} >
        <textarea placeholder="Digite aqui ..." ref={TextRef} />
        <button type="submit">Enviar</button>
      </form>

      <div className="EditUser">
        <img src={myUser && myUser.avatar} alt="Profile" />
        <div className="EditName">
          <input type="text" ref={UserInputRef} placeholder={myUser && myUser.name} />
          <button onClick={() => HandleChangeName()}>ALTERAR</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;