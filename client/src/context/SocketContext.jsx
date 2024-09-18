import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        if (selectedChatType &&
          (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
          console.log("Message passed the check", message);
          addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      socket.current.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Cleanup function
      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleReceiveMessage);
          socket.current.disconnect();
          console.log("Disconnected from socket server");
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
