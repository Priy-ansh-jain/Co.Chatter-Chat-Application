import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { IoArrowUndoSharp } from "react-icons/io5";
import { colors, getColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [choosenColor, setChoosenColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setChoosenColor(userInfo.color || 0);
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`);

      }
    }
  }, [userInfo]);


  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            image,
            color: choosenColor,
          },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating the profile.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set up profile");
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.image) {
          // console.log('Image URL:', res.data.image); // Debug log
          setImage(`${HOST}/${res.data.image}`);
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.success("Image updated successfully");
        }
      } catch (error) {
        console.error('Error updating image:', error);
      }
    }
  };




  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image deleted successfully.");
        setImage(null)
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image.");
    }
  };


  return (
    <div className="h-[100vh] flex items-center justify-center flex-col gap-10 bg-[#AC6AFF]">
      <div className="flex flex-col w-[80vw] md:w-max">
        <div>
          <IoArrowUndoSharp
            className="text-4xl lg:text-6xl text-black/90 cursor-pointer hover:text-lime-500"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-5">
          <div
            className="h-full w-32 md:w-48 relative flex items-center last:justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="bg-black overflow-hidden h-32 w-32 md:w-38 md:h-38 ">
              <Avatar className="h-32 w-32 md:w-38 md:h-38">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="Profile"
                    className="object-cover overflow-hidden h-full w-full "
                  />
                ) : (
                  <div
                    className={`uppercase w-32 h-32 md:w-38  md:h-38 items-center text-5xl border-[2px] flex justify-center rounded-se-[2rem] overflow-hidden ${getColor(
                      choosenColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 h-32 xl:mt-[5.8rem] lg:mt-[3.7rem] s flex items-center justify-center bg-black/20 rounded-se-[2rem] w-32 md:h-38 md:w-38 cursor-pointer"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl hover:text-red-500" />
                  ) : (
                    <FaPlus className="text-white text-3xl" />
                  )}
                </div>
              )}
              <input
                type="file"
                name="profile-image"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                accept=".png, .jpg, .jpeg, .svg, .webp"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 text-black items-center justify-center">
            <div className="w-full">
              <input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-black text-white border-none w-full"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="First Name"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 8) {
                    setFirstName(value);
                  } else {
                    toast.error("First name cannot be longer than 8 characters.");
                  }
                }}
                value={firstName}
                className="rounded-lg p-6 bg-black text-white border-none w-full hover:text-orange-400"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-black text-white border-none w-full hover:text-orange-400"
              />
            </div>
            <div className="flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${choosenColor === index
                    ? "outline outline-2 outline-neutral-800"
                    : ""
                    }`}
                  onClick={() => setChoosenColor(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full bg-[hero]">
          <Button
            className="w-full mt-4 bg-black hover:bg-cyan-600 text-white p-5 hover:text-black"
            onClick={saveChanges}
          >
            Save The Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;











