import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import useAxios from "../Hooks/useAxios";

const ChatBox = ({
  chat,
  currentUserId,
  setSendMessage,
  receiveMessage,
  setReceiveMessage,
}) => {
  const axiosInstance = useAxios();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  //! Find whome to chat
  const receiverId = chat.members.find((id) => id != currentUserId);
  const { data: userData } = useQuery({
    queryKey: ["receiver", receiverId],
    queryFn: async ({ queryKey }) => {
      const data = await axiosInstance.get(`/get-userr/${queryKey[1]}`);
      return data.data;
    },
  });

  //! Find Messages
  const { data: ss } = useQuery({
    queryKey: ["messages", chat?._id],
    queryFn: async ({ queryKey }) => {
      const messages = await axiosInstance.get(`/message/${queryKey[1]}`);
      return messages.data;
      // setMessages(messages.data);
    },
  });

  //! Real time msg receive
  useEffect(() => {
    if (receiveMessage && receiveMessage?.chatId == chat?._id) {
      setMessages([...messages, receiveMessage]);
      ss.push(receiveMessage);
      setReceiveMessage("");
    }
  }, [receiveMessage, chat?._id, messages, setReceiveMessage, ss]);

  //! Always Scroll Down
  useEffect(() => {
    scroll.current?.scrollIntoView();
    // scroll.current?.scrollIntoView({ behavior: "smooth" });
  });

  //! Send Message
  const handleSend = async (event) => {
    if (!newMessage) {
      alert();
      return;
    }
    event.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };
    try {
      const { data } = await axiosInstance.post("/message", message);
      setMessages([...messages, data]);
      ss.push(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    // ! Active Socket
    const receiverId = chat.members.find((id) => id != currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  //   if (!userData) return <p>Loading......</p>;
  return chat && userData ? (
    <div className="bg-[#333] grid grid-rows-[12vh,67vh,10vh] border-l">
      {/* Receiver Part  */}
      <div className="bg-primary rounded-full text-white flex items-center gap-2 pl-5 mt-2 mx-2">
        <img
          className="w-12 h-12 rounded-full"
          src={userData?.profilePicture}
          alt=""
        />
        <div className="flex flex-col items-start justify-center">
          <span className="font-semibold">{userData.name}</span>
        </div>
      </div>
      {/* Messaging Part  */}
      <div className="scrollbar flex flex-col gap-2 p-6 overflow-y-scroll bg-[#333]">
        {ss?.map((msg) => (
          <div
            ref={scroll}
            key={msg._id}
            className={
              msg.senderId == currentUserId
                ? "border border-[#1976D2] text-white p-4 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-none max-w-md w-fit flex flex-col gap-2 self-end "
                : "border text-white p-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-0 max-w-md w-fit flex flex-col gap-2"
            }
          >
            <span className="">{msg.text}</span>
            <span className="text-xs bg-white text-[#333] rounded-full px-2 py-[2px] w-max">
              {format(msg.createdAt)}
            </span>
          </div>
        ))}
      </div>
      {/* Input Field  */}
      <div className="bg-[#333] text-white flex justify-between h-full items-center gap-4 p-4 self-end">
        <div className="">+</div>
        <InputEmoji value={newMessage} onChange={(e) => setNewMessage(e)} />
        <Button onClick={handleSend} variant="contained">
          Send
        </Button>
      </div>
    </div>
  ) : (
    <span className="flex self-center justify-center text-xl h-screen text-white bg-red-600">
      Tap on a Chat to Start Conversation...
    </span>
  );
};

export default ChatBox;
