import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  // user registration
  static async userRegistration(req, res) {
    try {
      const { isGuestUser, userName, age, gender, email, password } = req.body;
      console.log(req.body);

      // check if all fields are provided
      if (isGuestUser === undefined || !userName || !age || !gender) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // check if all fields are provided if isGuestUser is false
      if (isGuestUser === false && (!email || !password)) {
        return res.status(400).json({
          message: "All fields are required",
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

      // create user
      const user = await UserModel.create(data);

      // generate jwt token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  // user login
  static async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      // check if all fields are provided
      if (!email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      // find user with same email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email is not registered" });
      }

      // check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // generate jwt token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      res
        .status(200)
        .json({ message: "User logged in successfully", user, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
