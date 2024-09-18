import { useEffect, useRef, useState } from "react";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { RiEmojiStickerLine } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";
import { IoSendOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";

const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();

  const emojiRef = useRef();

  const [message, setMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleEmojiClick = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact" && message.trim()) {
      const newMessage = {
        sender: userInfo.id,
        content: message.trim(),
        recipient: selectedChatData._id,
        messageType: "text",
        timestamp: new Date(),
        fileUrl: undefined,
      };

      socket.emit("sendMessage", newMessage);

      // Clear the message input after sending
      setMessage("");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  return (
    <div className="flex  relative justify-center items-center rounded-md w-full pt-5">
      <div className="flex-1 flex items-center gap-5 pr-5 bg-[#2c2436] rounded-md">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent focus:border-none focus:outline-none text-[#f8f4f4]"
          placeholder="Message Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-400 font-bold focus:border-none focus:outline-none focus:text-white duration-500 transition-all"
          onClick={() => setEmojiPickerOpen(true)}
        >
          <RiEmojiStickerLine />
        </button>
        <div className="absolute bottom-[4.2rem] right-4" ref={emojiRef}>
          <EmojiPicker
            theme="dark"
            open={emojiPickerOpen}
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
          />
        </div>
        <div className="relative">
          <button
            className="text-neutral-600 font-bold focus:border-none focus:outline-none focus:text-white duration-500 transition-all"
            onClick={() => setIsPopupVisible(!isPopupVisible)}
          >
            <FaArrowUpRightDots />
          </button>
          {isPopupVisible && (
            <div>
              <button className="absolute top-[-3rem] -right-3 bg-[#2c2436] focus:border-none focus:outline-none rounded-md shadow-lg p-2 flex items-center">
                <GrAttachment size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        className="w-[4rem] h-[4rem] hover:cursor-grab rounded-sm bg-[#a357ff] hover:bg-[#2c2436] p-5 hover:p-4 flex items-center justify-center"
        onClick={handleSendMessage}
      >
        <IoSendOutline className="text-[40px] overflow-hidden hover:text-[#a357ff]" />
      </button>
    </div>
  );
};

export default MessageBar;
