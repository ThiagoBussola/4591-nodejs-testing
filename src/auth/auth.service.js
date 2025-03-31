import jwt from "jsonwebtoken";

export class AuthService {
  generateToken(user) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}

export const authService = new AuthService();
