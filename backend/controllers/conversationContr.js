import Conversation from "../models/Conversation.js";
import Investor from "../models/investor.js";
import Entre from "../models/entre.js"

export const getConversation= async (req, res) => {
  try {
    const senderEmail = req.user.emailid; 
    const senderName = req.user.username;

    console.log(senderName);

    const receiverEmail = req.body.receiverEmail; 
    let receiverName;
    const userRole = req.body.userRole;

    if (userRole === "investor") {
      // receiver role is entre
      const receiver = await Entre.findOne({emailid: receiverEmail});
      receiverName = receiver.username;
    }
    else {
      const receiver = await Investor.findOne({emailid: receiverEmail});
      receiverName = receiver.username;
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderEmail, receiverEmail] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderEmail, receiverEmail],
        names: [senderName, receiverName]
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllConvos= async (req, res) => {
  try {
    const userEmail = req.user.emailid;
    const conversations = await Conversation.find({
      members: { $in: [userEmail] },
    });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


