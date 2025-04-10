import { authService } from "./auth.service.js";
import { errorMessages } from "../enums/errorMessages.enum.js";

export class AuthController {
  async register(req, res) {
    const { username, email, password } = req.body;

    try {
      const newUser = await authService.registerUser({
        username,
        email,
        password,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const loginResponse = await authService.loginUser({ email, password });
      return res.status(200).json(loginResponse);
    } catch (error) {
      return res
        .status(500)
        .json({ message: errorMessages.INTERNAL_SERVER_ERROR });
    }
  }
}

export const authController = new AuthController();
