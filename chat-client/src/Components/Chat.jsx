import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import "../CSS/Chat.css";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../Hooks/useAxios";
import useUser from "../Hooks/useUser";
import ChatBox from "./ChatBox";
import Conversation from "./Conversation";

const Chat = () => {
  const { user: DBuser } = useUser();
  const axiosInstance = useAxios();
  // const [chats, setChats] = useState([]);
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
    });
  });

  //! Get Sidebar Chats
  const { data: chats } = useQuery({
    queryKey: ["conversations", DBuser?._id],
    queryFn: async ({ queryKey }) => {
      const data = await axiosInstance.get(`/chat/${queryKey[1]}`);
      return data.data;
    },
  });

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
  if (!chats || !DBuser) return <p className="text-center">Loading...00...</p>;
  return (
    <div className="flex bg-[#333]">
      {/* Left  */}
      <div className="w-[20%] flex flex-col">
        <p className="text-xl font-semibold text-white text-center border w-max mx-auto my-3 py-2 px-10 rounded-full border-primary">
          CHATS
        </p>
        <div className="flex flex-col">
          {chats.map((chat) => (
            <div
              className={`${chat?._id == currentChat?._id ? "bg-primary" : ""}`}
              onClick={() => setCurrentChat(chat)}
              key={chat._id}
            >
              {chat && (
                <Conversation
                  online={checkOnlineStatus(chat)}
                  data={chat}
                  currentUserId={DBuser._id}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Right  */}
      <div className="w-[80%] flex flex-col gap-4">
        <div className="">
          {currentChat && (
            <ChatBox
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
              setReceiveMessage={setReceiveMessage}
              chat={currentChat}
              currentUserId={DBuser._id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
