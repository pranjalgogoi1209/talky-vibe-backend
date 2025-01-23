import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(401)
        .json({ message: "Unauthorized, header authorization not found" });

    if (!req.headers.authorization.startsWith("Bearer"))
      return res
        .status(401)
        .json({ message: "Unauthorized, Bearer not found" });

    if (!req.headers.authorization.split(" ")[1])
      return res.status(401).json({ message: "Unauthorized, token not found" });

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded._id).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
