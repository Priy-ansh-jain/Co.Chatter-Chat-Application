import { useState } from "react";
import { useAppStore } from "@/store";
import animationData from "../../../../../assets/close.json";
import { IoCloseOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constant";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { closeChat, selectedChatData, selectedChatType } = useAppStore((state) => ({
    closeChat: state.closeChat,
    selectedChatData: state.selectedChatData,
    selectedChatType: state.selectedChatType,
  }));

  return (
    <div className="border-b-2 h-[10vh] flex items-center justify-between p-2 ">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative">
          <div className="overflow-hidden h-12 w-12 rounded-full">
            <Avatar className="h-full w-full flex items-center justify-center">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}?t=${Date.now()}`} // Cache-busting query param
                  alt="Profile"
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.target.onerror = null;
                    e.target.src = '/path/to/placeholder/image.jpg'; // Fallback image
                  }}
                />
              ) : (
                <div
                  className={`uppercase w-16 h-16 flex items-center justify-center text-lg border-2 rounded-se-[2rem] overflow-hidden ${getColor(
                    selectedChatData?.colors
                  )}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData?.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
        </div>
        <div className="text-[black] uppercase font-bold">
          {selectedChatType === "contact" &&
            selectedChatData.firstName ?
            `${selectedChatData.firstName} ${selectedChatData.lastName} ` : selectedChatData.email}
        </div>
      </div>

      <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Lottie Animation Button */}
        <button
          className={`text-neutral-800 font-bold focus:border-none focus:outline-none w-[30px] text-3xl h-[30px] focus:text-white duration-500 transition-all ${isHovered ? "invisible" : "visible"
            }`}
        >
          <Lottie
            options={{
              animationData,
              loop: true,
              autoplay: true,
            }}
            height={20}
            width={20}
          />
        </button>

        {/* Conditionally render the close icon */}
        {isHovered && (
          <button
            className="absolute left-0 text-neutral-800 font-bold focus:border-none focus:outline-none focus:text-white duration-500 transition-all"
            onClick={closeChat}
          >
            <IoCloseOutline className="text-[2rem]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
