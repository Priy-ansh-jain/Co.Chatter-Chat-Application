import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { RiContactsFill } from "react-icons/ri";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from 'react-lottie';
import { animationDefaultOptions, getColor } from '@/lib/utils';
import apiClient from "@/lib/api-client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { useAppStore } from "@/store";

const NewDM = () => {

  const { setSelectedChatType, setSelectedChatData } = useAppStore();


  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setFindContactDetail([]);
  };


  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [findContactDetail, setFindContactDetail] = useState([]); // Ensure this is an array

  const searchContacts = async (findContact) => {
    try {
      if (findContact.length > 0) {
        const res = await apiClient.post(SEARCH_CONTACTS_ROUTES, { findContact },
          { withCredentials: true });
        if (res.status === 200 && res.data.contacts) {
          setFindContactDetail(res.data.contacts);
          // console.log("Contacts found:", res.data.contacts); // Log contacts
        }
      } else {
        setFindContactDetail([]); // Clear contacts if search term is empty
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            < RiContactsFill
              className="duration-300 transition-300 text-white hover:text-[#4c4c4c]"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contacts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="h-[600px] w-[300px] flex-col  flex border-2 border-[#AC6AFF]">
          <DialogHeader>
            <DialogTitle className="-mt-2">Contacts</DialogTitle>
            <DialogDescription>
              {/* Add description here if needed */}
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Input
              className="border-none bg-[#bc7aff] text-black"
              placeholder="Search Contacts"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div>
              {findContactDetail.length > 0 ? (
                findContactDetail.map((contact, index) => (
                  <div key={contact.id || index} className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)} >
                    <div className="w-16 h-16 relative">
                      <div className="overflow-hidden h-16 w-16 rounded-md">
                        <Avatar className="h-full w-full flex items-center justify-center">
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
                              className={`uppercase w-16 h-16 flex items-center justify-center text-lg border-2 rounded-se-[2rem] overflow-hidden ${getColor(
                                contact.colors
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.charAt(0)
                                : contact.email.charAt(0)}
                            </div>
                          )}
                        </Avatar>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-gray-600">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 md:bg-[#ffffff] md:flex flex-col justify-center items-center duration-1000 transition-all">
                  <Lottie
                    options={animationDefaultOptions} // Ensure this contains correct Lottie data
                    height={50}
                    width={50}
                    isClickToPauseDisabled={true}
                  />
                  <div className='text-opacity-80 flex flex-col gap-5 items-center lg:text-2xl text-lg transition-all duration-300 text-center mt-5'>
                    <h3 className='poppins-semibold'>
                      Hi <span className='text-[#FFC876]'> ! </span>
                      Search <span className='text-[#FFC876]'> new </span><span>
                        Contacts.
                      </span>
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;

