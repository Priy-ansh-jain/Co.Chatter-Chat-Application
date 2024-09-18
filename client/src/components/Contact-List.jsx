import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constant"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

const ContactList = ({ contacts, isChannel = false }) => {
  const { setSelectedChatData, setSelectedChatType, selectedChatData, setSelectedChatMessages, selectedChatType } = useAppStore()

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel")
    else setSelectedChatType("contact")
    setSelectedChatData(contact)

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([])
    }
  }

  return (
    <div className="text-white mt-2 px-9">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            className={`p-2 py-2 transition-all duration-300 cursor-pointer 
            ${selectedChatData && (selectedChatData._id === contact._id) ? "bg-[#00000046]" : "hover:bg-[orange]"}`} // Changed hover color
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 relative">
                <div className="overflow-hidden h-8 w-8 rounded-full">
                  <Avatar className="h-full w-full flex items-center justify-center ">
                    {contact.image ? (
                      <AvatarImage
                        src={`${HOST}/${contact.image}?t=${Date.now()}`} // Cache-busting query param
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
                        className={`uppercase w-full h-full flex items-center justify-center text-lg border-2 rounded-full overflow-hidden ${getColor(
                          contact.colors
                        )}`}
                      >
                        {contact.firstName
                          ? contact.firstName.charAt(0)
                          : contact.email
                            ? contact.email.charAt(0)
                            : '?'} {/* Fallback character if no name or email */}
                      </div>
                    )}
                  </Avatar>
                </div>
              </div>
              <div className="text-[#e6e4e4] text-xs font-bold uppercase">
                {selectedChatType === "contact" &&
                  contact.firstName ?
                  `${contact.firstName} 
                  ${contact.lastName} ` : contact.email}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-2">
          No contacts available.
        </div>
      )}
    </div>
  );
}

export default ContactList;
