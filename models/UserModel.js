import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    isGuestUser: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 70,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true,
      required: function () {
        return !this.isGuestUser;
      },
    },
    password: {
      type: String,
      trim: true,
      required: function () {
        return !this.isGuestUser;
      },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
