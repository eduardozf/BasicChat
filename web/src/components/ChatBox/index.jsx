import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import './styles.css';
import NotfSound from '../../assets/Notification.wav'

const initialUserId = new Date().getTime().toString();

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [myUser, setMyUser] = useState(
    { name: `User${initialUserId}`, avatar: `https://api.hello-avatar.com/adorables/140/${initialUserId}` }
  );
  const TextRef = useRef();
  const UserInputRef = useRef();
  const NotificationRef = useRef();

  //Connect to WebSocket
  useEffect(() => {
    setSocket(io('ws://localhost:3333'));
  }, [])

  //Message Recived
  useEffect(() => {
    if (!socket) return;

    socket.on("message", newMessage => {
      document.querySelector('#Notification').play();
      setMessages(oldMessages => [...oldMessages, newMessage])
    });
    socket.on("sync", allMessages => {
      setMessages(allMessages)
    });
  }, [socket])

  function ShowLocalMessage() {
    const newMessage = { user: myUser, content: TextRef.current.value }
    setMessages(oldMessages => [...oldMessages, newMessage])
  }

  function HandleSubmit(e) {
    e.preventDefault();
    if (!socket || !TextRef) return;
    if (!(TextRef.current.value.trim().length > 1)) return alert('You need to type somthing before submit!');

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
      <audio id="Notification" src={NotfSound} type="audio/wav" ref={NotificationRef} />
      <div className="Messages">
        {(messages.length < 1) ? (<div>No messages avaliable.</div>) : ''}
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

      <form className="TextInput" onSubmit={(e) => HandleSubmit(e)} >
        <textarea placeholder="Type something ..." ref={TextRef} />
        <button type="submit">Submit</button>
      </form>

      <div className="EditUser">
        <img src={myUser && myUser.avatar} alt="Profile" />
        <div className="EditName">
          <input type="text" ref={UserInputRef} placeholder={myUser && myUser.name} />
          <button onClick={() => HandleChangeName()}>Change</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;