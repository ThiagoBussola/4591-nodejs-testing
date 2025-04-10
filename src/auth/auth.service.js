import jwt from "jsonwebtoken";
import { userService } from "../user/user.service.js";
import * as bcrypt from "bcrypt";
import { errorMessages } from "../enums/errorMessages.enum.js";

export class AuthService {
  async registerUser({ username, email, password }) {
    const [userByEmail, userByUsername] = await Promise.all([
      userService.findByEmail(email),
      userService.findByUsername(username),
    ]);

    if (userByEmail) {
      throw new Error(errorMessages.EMAIL_ALREADY_EXISTS);
    }
    if (userByUsername) {
      throw new Error(errorMessages.USERNAME_ALREADY_EXISTS);
    }

    const newUser = await userService.createUser({
      username,
      email,
      password,
    });

    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
  }

  async loginUser({ email, password }) {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw new Error(errorMessages.INTERNAL_SERVER_ERROR);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(errorMessages.INTERNAL_SERVER_ERROR);
    }

    const token = this.generateToken(user);

    return {
      token,
      userId: user._id,
      username: user.username,
    };
  }

  generateToken(user) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}

export const authService = new AuthService();
