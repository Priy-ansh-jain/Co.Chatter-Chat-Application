import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"

const ChatContainer = () => {
  return (
    <div className="fixed top-0 w-[100vw] px-2 flex flex-col md:static md:flex-1 bg-[#f5f2f6]">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  )
}

export default ChatContainer


