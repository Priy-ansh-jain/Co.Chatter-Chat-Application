import { Router } from "express"; // Importing the Router function from the Express library.
import {
  addProfileImage,
  getUserInfo,
  login,
  signup,
  updateProfile,
  removeProfileImage,
  logout,
} from "../controllers/AuthControllers.js"; // Importing various controller functions from AuthControllers.js.
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Importing the verifyToken middleware function.
import multer from "multer"; // Importing the multer library, which is used for handling file uploads.

const upload = multer({
  dest: "uploads/profiles/",
}); // Configuring multer to store uploaded files in the "uploads/profiles/" directory.

const authRoutes = Router(); // Creating a new router object to define routes.

authRoutes.post("/signup", signup); // Defining a POST route for user signup. Calls the signup controller function.
authRoutes.post("/login", login); // Defining a POST route for user login. Calls the login controller function.
authRoutes.get("/user-info", verifyToken, getUserInfo); // Defining a GET route for retrieving user information. Requires verification of the JWT token.
authRoutes.post("/update-profile", verifyToken, updateProfile); // Defining a POST route for updating the user profile. Requires verification of the JWT token.
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
); // Defining a POST route for adding a profile image. Requires verification of the JWT token and handles single file upload.
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage); // Defining a DELETE route for removing the profile image. Requires verification of the JWT token.
authRoutes.post("/logout", logout); // Defining a POST route for logging out. Calls the logout controller function.

export default authRoutes; // Exporting the router object so it can be used in other parts of the application.
