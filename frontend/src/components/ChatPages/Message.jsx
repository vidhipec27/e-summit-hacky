const Message = ({ message, own }) => {
    console.log("be logging message.jsx",message.sender);
  return (
    <div className={`message ${own ? "own" : ""}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
