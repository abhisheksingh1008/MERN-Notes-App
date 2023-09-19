import User from "../models/userModel.js";
import Note from "../models/noteModel.js";
import HttpError from "../models/http-error.js";
import {
  createHashedPasswrod,
  comparePassword,
  generateToken,
} from "../helpers/authHelpers.js";

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();

    let userData = users.map((user) => {
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      users: userData,
    });
  } catch (error) {
    return next(new HttpError("Couldn't fetch users form the database.", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.length === 0) {
    return next(new HttpError("Email cannot be empty.", 400));
  }

  if (!password || password.length === 0) {
    return next(new HttpError("Password cannot be empty.", 400));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(
        new HttpError(
          "Cannot find a user with provided email id. Provide valid credentials or maybe try signing up instead.",
          400
        )
      );
    }

    if (!(await comparePassword(password, existingUser.password))) {
      return next(
        new HttpError(
          "Invalid credentials. Please try agian with correct credentials.",
          400
        )
      );
    }

    const token = generateToken(existingUser._id, existingUser.email);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        prefersGridView: existingUser.prefersGridView,
        token,
      },
    });
  } catch (error) {
    return next(new HttpError("Unable to login. Please try again later.", 500));
  }
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) {
    return next(new HttpError("Name cannot be empty.", 400));
  }

  if (!email || email.trim().length === 0) {
    return next(new HttpError("Email cannot be empty.", 400));
  }

  if (!password || password.trim().length === 0) {
    return next(new HttpError("Password cannot be empty.", 400));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.email === email) {
      return next(
        new HttpError(
          "A user already exists with the provided email id. Try logging in.",
          400
        )
      );
    }

    const hashedPassword = await createHashedPasswrod(password);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await createdUser.save();

    const token = generateToken(createdUser._id, email);

    res.status(201).json({
      success: true,
      message: "New user created successfully!",
      user: {
        userId: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        prefersGridView: createdUser.prefersGridView,
        token,
      },
    });
  } catch (error) {
    return next(new HttpError("Unable to signup, please try again.", 500));
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(
        new HttpError("Could not find a user with provided user id.", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "User found.",
      user: {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        prefersGridView: existingUser.prefersGridView,
      },
    });
  } catch (error) {
    return next(
      new HttpError(
        "Could not get user at the moment please try again later.",
        500
      )
    );
  }
};

const validatePassword = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(
        new HttpError("Could not find a user with provided email id", 400)
      );
    }

    if (!(await comparePassword(password, existingUser.password))) {
      return next(new HttpError("Invalid password.", 400));
    }

    res.status(200).json({
      success: true,
      message: "Password is correct.",
    });
  } catch (error) {
    return next(new HttpError("Couldn't validate password", 500));
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { updateType } = req.body;

  try {
    let existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(
        new HttpError("Couldn't find a user with provided user id.", 400)
      );
    }

    if (!(existingUser._id.toString() === req.user._id.toString())) {
      return next(
        new HttpError(
          "Only the owner of a account can modify or delete it.",
          400
        )
      );
    }

    if (updateType === "CHANGE PREFERENCES") {
      const { prefersGridView } = req.body;

      existingUser.prefersGridView = prefersGridView;

      await existingUser.save();

      res.status(200).json({
        success: true,
        message: "Preferences changed successfully!",
        prefersGridView: existingUser.prefersGridView,
      });
    } else if (updateType === "CHANGE PASSWORD") {
      const { oldPassword, newPassword } = req.body;

      if (!(await comparePassword(oldPassword, existingUser.password))) {
        return next(new HttpError("Invalid password.", 400));
      }

      existingUser.password = newPassword;

      await existingUser.save();

      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Couldn't update user, please try again later.", 500)
    );
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const existingUser = await User.findById(userId).populate("notes");

    if (!existingUser) {
      return next(
        new HttpError("Could not find a user with provided user id.", 400)
      );
    }

    if (!(existingUser._id.toString() === req.user._id.toString())) {
      return next(
        new HttpError(
          "Only the owner of a account can update or delete it.",
          400
        )
      );
    }

    await User.deleteOne({ _id: existingUser._id });

    for (let index = 0; index < existingUser.notes.length; index++) {
      const note = existingUser.notes[index];
      await Note.deleteOne({ _id: note._id });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Couldn't delete user. Please try again later.", 500)
    );
  }
};

export {
  getUsers,
  login,
  signup,
  getUserById,
  validatePassword,
  updateUser,
  deleteUser,
};
