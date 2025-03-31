import User from "./user.schema.js";
import bcrypt from "bcrypt";

export class UserService {
  async createUser(user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return await User.create(user);
  }

  async findAll() {
    return await User.find({}).select("-password");
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("-password");
  }

  async findByUsername(username) {
    return await User.findOne({ username }).select("-password");
  }

  async updateUser(id, userData) {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }
}

export const userService = new UserService();
