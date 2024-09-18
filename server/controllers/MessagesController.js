import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    const { findContact } = req.body;
    if (!user1 || !user2) {
      return res.send({ message: "both user id's are requierd" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
