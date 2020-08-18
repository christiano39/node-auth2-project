const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const { username, password, department } = req.body;

  if (!username || !password || !department) {
    res.status(400).json({
      message:
        "Please provide all required fields: username, password, department",
    });
  }

  Users.findBy({ username })
    .then(([user]) => {
      if (user) {
        res.status(409).json({ message: "Username is already taken" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  const rounds = process.env.HASH_ROUNDS || 7;
  const hash = bcrypt.hashSync(password, rounds);

  Users.add({ username, password: hash, department })
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Please provide both username and password" });
  }

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({
          message: "Successfully logged in",
          user: {
            id: user.id,
            username: user.username,
            department: user.department,
          },
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      require.status(500).json({ error: err.message });
    });
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const secret = process.env.JWT_SECRET || "secrety mcsecretface";

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
