const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  findChatSecondMemberInfo,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/find/members/:userId", findChatSecondMemberInfo);
router.get("/", getUsers);

module.exports = router;
