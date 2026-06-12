import jwt from "jsonwebtoken";
import blacklistmodel from "../models/blacklistmodel.js";

async function authuser(req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const istokenblacklisted = await blacklistmodel.findOne({ token });
  if (istokenblacklisted) {
    return res.status(401).json({ message: "Unauthorized: token is invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
}

export default authuser;