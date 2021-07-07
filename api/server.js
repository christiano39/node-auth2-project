const express = require("express");

const usersRoutes = require("../users/users-routes");
const authRoutes = require("../auth/auth-routes");

const server = express();

server.use(express.json());

server.use("/api/users", usersRoutes);
server.use("/api/auth", authRoutes);

module.exports = server;
