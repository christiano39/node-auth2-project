const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const secret = process.env.JWT_SECRET || "secrety mcsecretface";
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "Token expired or modified" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "Please provide token as authorization header" });
  }
};
