import { useState, useEffect } from 'react';
import animationData from "../../../assets/logo.json";
import Lottie from 'react-lottie'; // Adjust if you're using a different package
import ProfileInfo from './contact-profile/profile-info';
import NewDM from './new-dm';
import apiClient from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constant';
import { useAppStore } from '@/store';
import ContactList from '@/components/Contact-List';



const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, { withCredentials: true });
        console.log("Fetched contacts:", res.data.contacts); // Verify API response
        if (res.data.contacts) {
          setDirectMessagesContacts(res.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    getContacts();
  }, [setDirectMessagesContacts]);


  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 720); // Adjust the value as needed for your breakpoit
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`relative w-full ${isSmallScreen ? 'bg-[#110B19]' : 'bg-[#AC6AFF]'} md:w-[30vw] sm:w-[30vw] lg:w-[30vw] xl:w-[20vw] border-r-2 border-white`}
    >
      <div className=''>
        <div className='w-48 flex items-center '>
          <Lottie
            options={{
              animationData,
              loop: true,
              autoplay: true
            }}
          />
          <h3 className='font-semi-bold text-xl' > <span className='text-black font-bold'>Co</span>.<span>Chatter</span></h3>
        </div>
        <div className='my-5'>
          <div className='flex items-center justify-between pr-10'>
            <Title text="Direct Messages" />
            <NewDM />
          </div>
          <div className="max-h-[100vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </div>

        <div className='my-5'>
          <div className='flex items-center justify-between pr-10'>
            <Title text="Contacts" />
          </div>
        </div>
      </div>
      <ProfileInfo />

    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className='tracking-widest text-neutral-200 text-sm uppercase pl-10 font-light text-opacity-90'>{text}</h6>
  )
}
