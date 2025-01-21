import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

class UserController {
  // create user
  static async createUser(req, res) {
    try {
      const { isGuestUser, userName, age, gender, email, password } = req.body;
      console.log(req.body);

      // check if all fields are provided
      if (isGuestUser === undefined || !userName || !age || !gender) {
        return res
          .status(400)
          .json({ message: "All fields are required for isGuestUser is true" });
      }

      // check if all fields are provided if isGuestUser is false
      if (isGuestUser === false && (!email || !password)) {
        return res.status(400).json({
          message: "All fields are required for isGuestUser is false",
        });
      }

      // find user with same userName
      const userExistsWithSameUserName = await UserModel.findOne({ userName });
      if (userExistsWithSameUserName) {
        return res.status(400).json({ message: "Username is taken" });
      }

      // find user with same email if isGuestUser is false
      if (!isGuestUser) {
        const userExistsWithSameEmail = await UserModel.findOne({ email });
        if (userExistsWithSameEmail) {
          return res
            .status(400)
            .json({ message: "Email is already registered" });
        }
      }

      // check if age is between 18 and 70
      if (age < 18 || age > 70) {
        return res
          .status(400)
          .json({ message: "Age must be between 18 and 70" });
      }

      // check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!isGuestUser && !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }

      let data = {
        isGuestUser,
        userName,
        age,
        gender,
      };

      if (!isGuestUser) {
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // add email and password
        data.email = email;
        data.password = hashedPassword;
      }

      const user = await UserModel.create(data);
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
