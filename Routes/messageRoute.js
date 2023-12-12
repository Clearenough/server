const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.delete("/:messageId", deleteMessage);
router.get("/:chatId", getMessages);

module.exports = router;
