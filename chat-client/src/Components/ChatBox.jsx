import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { MdDownload } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import useAxios from "../Hooks/useAxios";
import useUser from "../Hooks/useUser";
import { base64 } from "../utils/base64";
import { imageHeightWidth } from "../utils/imageHeightWidth";
import { imgbbUploader } from "../utils/imgbbUploader";
import { linkOrText } from "../utils/linkOrText";

const ChatBox = ({
  chat,
  currentUserId,
  setSendMessage,
  receiveMessage,
  setReceiveMessage,
}) => {
  const axiosInstance = useAxios();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [imageSending, setImageSending] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
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
      return;
    }
    setMessageSending(true);
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
    //Active Socket
    const receiverId = chat.members.find((id) => id != currentUserId);
    setSendMessage({ ...message, receiverId });
    setMessageSending(false);
  };

  //! Image Change which one to send
  const imageChange = async (event) => {
    const res = await imageHeightWidth(event.target.files[0]);
    const base = await base64(event.target.files[0]);
    setPreviewImage({ ...res, image: event.target.files[0], base });
  };

  //! Send Image
  const sendImage = async () => {
    setImageSending(true);
    const url = await imgbbUploader(previewImage.image);
    const message = {
      senderId: currentUserId,
      text: url,
      chatId: chat._id,
    };
    try {
      const { data } = await axiosInstance.post("/message", message);
      messages.push(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    const receiverId = chat.members.find((id) => id != currentUserId);
    setSendMessage({ ...message, receiverId });
    setPreviewImage(null);
    setImageSending(false);
  };

  return (
    chat &&
    userData && (
      <div className="bg-[#333] grid grid-rows-[8vh,75vh,10vh] md:grid-rows-[12vh,67vh,10vh] border-l">
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
            {messages.map((msg) =>
              linkOrText(msg.text) == "MSG" ? (
                <div
                  ref={scroll}
                  key={msg._id}
                  className={`${
                    msg.senderId == currentUserId ? "chat-end" : "chat-start"
                  } chat`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={`${
                          msg.senderId == currentUserId
                            ? user.profilePicture
                            : userData.profilePicture
                        } `}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    <time className="text-xs opacity-50">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </time>
                  </div>
                  <div className="chat-bubble bg-primary text-white">
                    {msg.text}
                  </div>
                  <div className="chat-footer opacity-50">
                    {format(msg.createdAt)}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    msg.senderId == currentUserId
                      ? "self-end relative"
                      : "relative"
                  }
                  ref={scroll}
                  key={msg._id}
                >
                  <img
                    src={msg.text}
                    className={`aspect-video w-56 rounded-md`}
                    alt="selected Image"
                  />
                  <MdDownload
                    onClick={async () => {
                      const response = await fetch(msg.text);
                      const blob = await response.blob();
                      const downloadButton = document.createElement("a");
                      const blobUrl = window.URL.createObjectURL(blob);
                      downloadButton.href = blobUrl;
                      downloadButton.download = "downloaded_image.jpg";
                      document.body.appendChild(downloadButton);
                      downloadButton.click();
                      document.body.removeChild(downloadButton);
                    }}
                    className="absolute bottom-2 left-2 bg-primary text-white p-1 text-3xl bg-opacity-70 rounded-md cursor-pointer duration-300 active:scale-75 select-none"
                  />
                  <span
                    className={`text-xs bg-white text-[#333] rounded-full px-2 py-[2px] w-max absolute ${
                      msg.senderId == currentUserId
                        ? "right-[230px] top-5"
                        : "left-[230px] top-5"
                    }`}
                  >
                    {format(msg.createdAt)}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="flex items-center justify-center">
            <ImSpinner8 className="text-2xl animate-spin text-primary" />
          </p>
        )}
        {/* Input Field  */}
        <div className="bg-[#333] text-white flex justify-between h-full items-center gap-4 p-4 self-end relative border">
          {/* Image Preview  */}
          {previewImage && (
            <div className="bg-primary p-5 rounded-md absolute bottom-full flex items-center gap-4">
              <img
                src={previewImage.base}
                className={`${
                  Math.abs(previewImage.width - previewImage.height) > 100
                    ? "aspect-video"
                    : "aspect-square"
                } w-56 rounded-md`}
                alt="selected Image"
              />
              {imageSending ? (
                <ImSpinner8 className="text-6xl bg-white text-primary rounded-full p-2 animate-spin" />
              ) : (
                <TbSend
                  onClick={sendImage}
                  className="text-6xl bg-white text-primary rounded-full p-2 duration-300 select-none active:scale-90 cursor-pointer"
                />
              )}
            </div>
          )}
          <label
            htmlFor="imgSender"
            className="cursor-pointer border p-2 rounded-full"
          >
            <FaPlus />
          </label>
          <input
            className="hidden"
            accept="image/*"
            onChange={(event) => imageChange(event)}
            type="file"
            id="imgSender"
          />
          <InputEmoji value={newMessage} onChange={(e) => setNewMessage(e)} />
          <Button
            onClick={handleSend}
            disabled={messageSending}
            variant="contained"
          >
            Send
          </Button>
        </div>
      </div>
    )
  );
};

export default ChatBox;
