import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).send({ message: "No token provided." });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).send({ message: "JWT_SECRET is not set." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    req.user = decoded;
    next();
  });
};
