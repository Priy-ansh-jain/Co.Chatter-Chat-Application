import moment from "moment";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constant";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        console.log("Fetched Messages:", res.data.messages); // Log fetched messages
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
          console.log("Updated Messages State:", selectedChatMessages); // Log updated state
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index} className="flex flex-col">
          {showDate && (
            <div className="text-center text-gray-500 my-4 text-sm">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {


    return (
      <div className={`flex items-center gap-2 ${message.sender === selectedChatData._id ? "justify-start" : "justify-end"}`}>
        {message.messageType === "text" && (
          <div className={`${message.sender === selectedChatData._id ? "bg-[#ba51ff]/10 text-[#ba51ff]/90 border-[#ba51ff]/50 " : "bg-gray-200 text-black border-gray-300"} 
            border px-4 py-2 my-1 rounded-se-xl rounded-ee-lg rounded-bl max-w-[70%] break-words`}>
            {message.content}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-2 border-[.5rem] border-[#0f1110cd]">
      <div className="flex flex-col overflow-y-auto h-[61vh] scrollbar-hidden px-4">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
