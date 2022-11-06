function Message({ message, isSelf }) {
  const { timestamp, content } = message;
  const className = `msg-container msg-${isSelf ? "self" : "other"}`;
  return (
    <div className={className} key={timestamp}>
      {content}
    </div>
  );
}

export default Message;
