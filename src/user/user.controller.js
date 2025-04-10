import { errorMessages } from "../enums/errorMessages.enum.js";
import { userService } from "./user.service.js";

class UserController {
  async findAll(req, res) {
    try {
      const users = await userService.findAll();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ message: errorMessages.FIND_ALL_FAILED });
    }
  }

  async findById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: errorMessages.USER_NOT_FOUND });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: errorMessages.FIND_BY_ID_FAILED });
    }
  }

  async findByEmail(req, res) {
    try {
      const user = await userService.findByEmail(req.params.email);
      if (!user) {
        return res.status(404).send({ message: errorMessages.USER_NOT_FOUND });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: errorMessages.FIND_BY_EMAIL_FAILED });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).send({ message: errorMessages.USER_NOT_FOUND });
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: errorMessages.UPDATE_FAILED });
    }
  }

  async delete(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).send({ message: errorMessages.USER_NOT_FOUND });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ message: errorMessages.DELETE_FAILED });
    }
  }
}

export default new UserController();
