import { Button } from "@mui/material";
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
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  //! Find whome to chat
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = chat?.members?.find((id) => id != currentUserId);
        const tempUserData = await axiosInstance.get(`/get-userr/${userId}`);
        setUserData(tempUserData.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat) getUserData();
  }, [currentUserId, chat, axiosInstance]);

  //! Find Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await axiosInstance.get(`/message/${chat._id}`);
        setMessages(messages.data);
        console.log(messages.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat) getMessages();
  }, [chat, axiosInstance]);

  //! Real time msg receive
  useEffect(() => {
    if (receiveMessage && receiveMessage?.chatId == chat?._id) {
      setMessages([...messages, receiveMessage]);
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
      setMessages([...messages, data]);
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
    <>
      <div className="bg-stone-200 grid grid-rows-[13vh,75vh,12vh] md:grid-rows-[13vh,66vh,10vh]">
        {chat && userData ? (
          <>
            <div className="bg-[#333] border border-r-0 text-white">
              {/* <div className="flex justify-between items-center"> */}
              <div className="flex items-center h-full gap-2 pl-5">
                <img
                  className="w-12 h-12 rounded-full"
                  src={userData?.profilePicture}
                  alt=""
                />
                <div className="flex flex-col items-start justify-center">
                  <span className="font-semibold">{userData.name}</span>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className="scrollbar flex flex-col gap-2 p-6 overflow-y-scroll border bg-[#333]">
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

            <div className="bg-[#333] text-white border border-r-0 flex justify-between h-full items-center gap-4 p-4 self-end">
              <div className="">+</div>
              <InputEmoji
                value={newMessage}
                onChange={(e) => setNewMessage(e)}
              />
              <Button
                onClick={handleSend}
                variant="contained"
                // endIcon={<SendIcon />}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <span className="flex self-center justify-center text-xl">
            Tap on a Chat to Start Conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
