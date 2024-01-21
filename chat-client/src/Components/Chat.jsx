import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import "../CSS/Chat.css";
import { useQuery } from "@tanstack/react-query";
import { ImSpinner8 } from "react-icons/im";
import useAxios from "../Hooks/useAxios";
import useUser from "../Hooks/useUser";
import { AuthContext } from "./AuthProvider";
import ChatBox from "./ChatBox";
import Conversation from "./Conversation";

const Chat = () => {
  const { user: DBuser } = useUser();
  const axiosInstance = useAxios();
  const { conversationOpen, setConversationOpen } = useContext(AuthContext);
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
    const intervalId = setInterval(() => {
      socket.current = io(import.meta.env.VITE_SOCKET);
      socket.current.emit("new-user-add", DBuser?._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [DBuser?._id]);

  // useEffect(() => {
  //   socket.current = io(import.meta.env.VITE_SOCKET);
  //   socket.current.emit("new-user-add", DBuser?._id);
  //   socket.current.on("get-users", (users) => {
  //     setOnlineUsers(users);
  //   });
  // }, [DBuser]);
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
  if (!chats || !DBuser)
    return (
      <p className="flex items-center justify-center h-[80vh]">
        <ImSpinner8 className="text-5xl animate-spin text-primary" />
      </p>
    );
  return (
    <div className="flex bg-[#333] relative">
      {/* Left  */}
      <div
        className={`w-[200px] fixed ${
          conversationOpen ? "left-0 md:left-0" : "left-full md:left-0"
        } md:relative h-screen md:h-full bg-[#333] z-10 md:w-[20%] flex flex-col`}
      >
        <p className="text-xl font-semibold text-white text-center border w-max mx-auto my-3 py-2 px-10 rounded-full border-primary">
          CHATS
        </p>
        <div className="flex flex-col">
          {chats.map((chat) => (
            <div
              className={`${chat?._id == currentChat?._id ? "bg-primary" : ""}`}
              onClick={() => {
                setCurrentChat(chat);
                setConversationOpen(false);
              }}
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
      <div className="w-full md:w-[80%] flex flex-col gap-4">
        <div className="">
          {currentChat ? (
            <ChatBox
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
              setReceiveMessage={setReceiveMessage}
              chat={currentChat}
              currentUserId={DBuser._id}
            />
          ) : (
            <div className="bg-[#222] w-full h-[93vh] md:h-[89vh] border-l flex items-center justify-center">
              <span className="flex self-center justify-center text-xl text-white">
                Tap on a Chat to Start Conversation...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
