const router = require("express").Router();
const Users = require("./users-model");
const restricted = require("../auth/restricted-mw");

router.get("/", restricted, (req, res) => {
  Users.findBy({ department: req.jwt.department })
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
