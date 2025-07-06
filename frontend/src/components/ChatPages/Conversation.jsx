const Conversation = ({ conversation, onClick }) => {
    console.log("convo",conversation);
  let partnerName;
  if (conversation.currentUser === conversation.members[0])
      partnerName = conversation.names[1];
  else
      partnerName = conversation.names[0];

  return (
    <div onClick={onClick} className="conversation">
      <p>{partnerName}</p>
    </div>
  );
};

export default Conversation;