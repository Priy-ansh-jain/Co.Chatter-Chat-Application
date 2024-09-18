import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { GiDiceFire } from "react-icons/gi";
import { toast } from "sonner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import apiClient from "@/lib/api-client"
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import Background from "../../assets/ChatLogo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords and Confirm Password must be the same");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setUserInfo(res.data.user);
        if (res.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
      console.log({ res });
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const res = await apiClient.post(SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      }
      console.log({ res });
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to Google sign-in
    window.location.href = "http://localhost:5179/auth/google";
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-orange-500 border-white border-2 shadow-2xl text-opacity-90 w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid grid-cols-1">
        <div className="h-[80vh] bg-white border-white border-2 shadow-2xl text-opacity-90 w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-se-[6rem] rounded-tl-[3rem] rounded-es-[3rem] grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col gap-8 items-center justify-center">
              <div className="flex items-center justify-center">
                <h1 className="flex gap-2 items-center text-3xl font-bold md:text-2xl ">Welcome <GiDiceFire /></h1>
              </div>
              <p className="font-medium text-center flex flex-nowrap">
                Fill in the details to get started with Co.chater
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Tabs className="w-3/4" defaultValue="login">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-transparent text-orange-400 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-stone-600 p-3 transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-transparent text-orange-400 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-stone-600 p-3 transition-all duration-300"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="flex flex-col gap-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-4 border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      type={passwordVisible ? "text" : "password"}
                      className="rounded-full p-4 border pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                  <Button onClick={handleLogin} className="rounded-full">
                    Login
                  </Button>
                  <Button onClick={handleGoogleSignIn} className="rounded-full mt-1 flex items-center justify-center gap-2">
                    Sign in with Google <FcGoogle size={20} />
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-4 border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      type={passwordVisible ? "text" : "password"}
                      className="rounded-full p-4 border pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Confirm Password"
                      type={confirmPasswordVisible ? "text" : "password"}
                      className="rounded-full p-4 border pr-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                  <Button onClick={handleSignup} className="rounded-full">
                    Sign Up
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="hidden lg:flex xl:flex justify-center items-center">
            <img src={Background} alt="background-login" className="h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
