import { userService } from "./user.service.js";

class UserController {
  async findAll(req, res) {
    try {
      const users = await userService.findAll();
      res.status(200).send(users);
    } catch (error) {
      console.error("Error in findAll:", error);
      res.status(500).send({ message: "Failed to retrieve users" });
    }
  }

  async findById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      console.error("Error in findById:", error);
      res.status(500).send({ message: "Failed to retrieve user" });
    }
  }

  async findByEmail(req, res) {
    try {
      const user = await userService.findByEmail(req.params.email);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      console.error("Error in findByEmail:", error);
      res.status(500).send({ message: "Failed to retrieve user by email" });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).send({ message: "Failed to update user" });
    }
  }

  async delete(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).send({ message: "Failed to delete user" });
    }
  }
}

export default new UserController();
