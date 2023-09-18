import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    notes: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Note",
      },
    ],
    prefersGridView: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
