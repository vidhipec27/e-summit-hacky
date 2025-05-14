const Conversation = ({ conversation, onClick }) => {
    console.log("convo",conversation);
  const partnerEmail = conversation.members.find(m => m !== conversation.currentUser);
  return (
    <div onClick={onClick} className="conversation">
      <p>{partnerEmail}</p>
    </div>
  );
};

export default Conversation;