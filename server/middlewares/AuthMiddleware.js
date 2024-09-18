import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library which is used to work with JSON Web Tokens (JWT).

// This function verifies the JWT token present in the cookies.
export const verifyToken = (req, res, next) => {
  // Retrieve the token from the cookies in the request object.
  const token = req.cookies.jwt;

  // If there is no token present, send a 401 (Unauthorized) response with an appropriate message.
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  // Verify the token using the JWT_KEY environment variable.
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    // If there's an error during verification (e.g., token is invalid or expired), send a 403 (Forbidden) response with an appropriate message.
    if (err) return res.status(403).json({ message: "Token is invalid" });

    // If the token is valid, extract the userId from the payload and attach it to the request object.
    req.userId = payload.userId;

    // Call the next middleware function in the stack.
    next();
  });
};
