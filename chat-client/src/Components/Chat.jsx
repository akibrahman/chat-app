import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import "../CSS/Chat.css";
import useAxios from "../Hooks/useAxios";
import useUser from "../Hooks/useUser";
import ChatBox from "./ChatBox";
import Conversation from "./Conversation";

const Chat = () => {
  const { user: DBuser } = useUser();
  const axiosInstance = useAxios();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();

  //! Send to Socket
  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //! Socket Setup
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET);
    socket.current.emit("new-user-add", DBuser?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [DBuser]);
  //! Receive from Socket
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
      console.log(data);
    });
  });

  //! Get Sidebar Chats
  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await axiosInstance.get(`/chat/${DBuser._id}`);
        setChats(data.data);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [axiosInstance, DBuser, DBuser?._id]);

  //! Find who are Online
  const checkOnlineStatus = (chat) => {
    const receiver = chat.members.find((id) => id != DBuser._id);
    const online = onlineUsers.find((user) => user.userId == receiver);
    return online ? true : false;
  };
  // const a = () => {
  //   axiosInstance.post("/message", {
  //     chatId: "657edde6d10c9bcf1751c6ec",
  //     senderId: "657eec64c3d8c6bb2025dd32",
  //     text: "Hi, Suchona baby",
  //   });
  // };
  if (!DBuser) return <p>Loading......</p>;
  return (
    <div className="flex">
      {/* Left  */}
      <div className="w-[20%] flex flex-col gap-4 bg-[#333] border-t p-4">
        <p className="text-2xl font-semibold text-white">Chats</p>
        <div className="flex flex-col gap-4">
          {chats.map((chat) => (
            <div onClick={() => setCurrentChat(chat)} key={chat._id}>
              <Conversation
                online={checkOnlineStatus(chat)}
                data={chat}
                currentUserId={DBuser._id}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Right  */}
      <div className="w-[80%] flex flex-col gap-4">
        <div className="">
          <ChatBox
            setSendMessage={setSendMessage}
            receiveMessage={receiveMessage}
            setReceiveMessage={setReceiveMessage}
            chat={currentChat}
            currentUserId={DBuser._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;