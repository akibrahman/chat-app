import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
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
  const { data: messages } = useQuery({
    queryKey: ["messages", chat?._id],
    queryFn: async ({ queryKey }) => {
      const messages = await axiosInstance.get(`/message/${queryKey[1]}`);
      return messages.data;
    },
  });

  //! Real time msg receive
  useEffect(() => {
    if (receiveMessage && receiveMessage?.chatId == chat?._id) {
      messages.push(receiveMessage);
      setReceiveMessage("");
    }
  }, [receiveMessage, chat?._id, messages, setReceiveMessage]);

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
      messages.push(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    // ! Active Socket
    const receiverId = chat.members.find((id) => id != currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  //   if (!userData) return <p>Loading......</p>;
  return (
    chat &&
    userData && (
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
        {messages ? (
          <div className="scrollbar flex flex-col gap-2 p-6 overflow-y-scroll bg-[#333]">
            {messages.map((msg) => (
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
        ) : (
          <p className="flex items-center justify-center">
            <ImSpinner8 className="text-2xl animate-spin text-primary" />
          </p>
        )}
        {/* Input Field  */}
        <div className="bg-[#333] text-white flex justify-between h-full items-center gap-4 p-4 self-end relative border">
          {/* Image Preview  */}
          <div className="bg-primary p-5 rounded-md absolute bottom-full">
            <img
              src="https://i.ibb.co/FqVvvzX/Linkdin.jpg"
              className="aspect-square h-56 w-56 rounded-md"
              alt=""
            />
          </div>
          <div className="cursor-pointer border rounded-full p-2 border-primary">
            <label htmlFor="imgSender" className="cursor-pointer">
              <FaPlus />
            </label>
            <input className="hidden" type="file" id="imgSender" />
          </div>
          <InputEmoji value={newMessage} onChange={(e) => setNewMessage(e)} />
          <Button onClick={handleSend} variant="contained">
            Send
          </Button>
        </div>
      </div>
    )
  );
};

export default ChatBox;
