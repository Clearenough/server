const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    let user = await userModel.findOne({ username });

    if (user)
      return res.status(400).json("user with given username already exist");

    user = new userModel({ name, username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = createToken(user.id);

    res.status(200).json({ _id: user._id, name, username, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json("Invalid username or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Invalid username or password");
    }
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, username, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChatSecondMemberInfo = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    const secondUsersId = chats
      .map((chat) => chat.members)
      .map((members) => {
        return members.filter((member) => {
          if (member !== userId) return member;
        });
      })
      .map((array) => array[0]);
    let secondUsers = [];
    for (let i = 0; i < secondUsersId.length; i++) {
      const secondUser = await userModel.findById(secondUsersId[i]);
      secondUsers.push(secondUser);
    }

    console.log(secondUsers);
    res.status(200).json(secondUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  findChatSecondMemberInfo,
};
