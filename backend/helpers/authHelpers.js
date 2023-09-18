import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createHashedPasswrod = async (password) => {
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create hashed password!");
  }

  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  let passwordIsValid;
  try {
    passwordIsValid = await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to compare password!");
  }

  return passwordIsValid;
};

const generateToken = (userId, email) => {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export { createHashedPasswrod, comparePassword, generateToken };
