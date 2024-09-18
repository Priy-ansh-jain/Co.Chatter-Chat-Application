import { useEffect } from "react";
import { useAppStore } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@radix-ui/react-tooltip";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, LOGOUT_ROUTE } from "@/utils/constant";
import { getColor } from "@/lib/utils";
import apiClient from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (res.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      } else {
        console.log("Unexpected response status:", res.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    // Fetch userInfo again to ensure it is updated if needed
  }, [userInfo]);

  return (
    <div className="absolute bottom-0 flex items-center justify-between w-full bg-white h-20 md:bg-black p-2 gap-1 ">
      <div className="flex gap-3 items-center justify-center ">
        <div className="w-16 h-16 relative">
          <Avatar className="w-full h-full overflow-hidden ">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}?t=${Date.now()}`} // Cache-busting query param
                alt="Profile"
                className="object-cover w-full h-full "
              // onError={(e) => {
              //   e.target.onerror = null;
              //   e.target.src = '/path/to/placeholder/image.jpg'; // Fallback image
              // }}
              />
            ) : (
              <div
                className={`uppercase w-full h-full flex items-center justify-center text-lg border-2 rounded-se-lg overflow-hidden border-n-800 ${getColor(
                  userInfo.colors
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-[#150404] md:text-[white] text-lg font-semibold">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email}
        </div>
      </div>
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaUserEdit
                className="text-[#141313] hover:text-neutral-400 text-2xl cursor-pointer md:text-white"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-black">Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-1 px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HiOutlineLogout
                className="text-[#8a47c0] hover:text-green-600 text-2xl cursor-pointer"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-black">Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
