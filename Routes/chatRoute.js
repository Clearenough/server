const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
  deleteChat,
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.delete("/:chatId", deleteChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
