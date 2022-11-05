import { useEffect, useState } from "react";
import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages } from "../utils";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const { messages, users, userId } = await getMessages();

      const uMap = formatUsers(users);
      uMap[userId] = { id: userId, isSelf: true };
      setUsersMap(uMap);

      messages.sort((a, b) => b.timestamp - a.timestamp);
      const msgs = formatMessages(messages, uMap);
      setInboxMap(msgs);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (inboxMap?.length) {
      const conversations = [...inboxMap].map((convo) => {
        const [mostRecentMessage] = convo.messages;
        const totalMessages = convo.messages.length;
        delete convo["messages"];
        return { ...convo, mostRecentMessage, totalMessages };
      });
      postInboxData({ conversations });
    }
  }, [inboxMap]);

  function handleClick(msgs) {
    console.log(msgs);
    setMessages(msgs);
  }

  return (
    <div className="inbox-view">
      <ul className="inbox-left-panel">
        {inboxMap?.map((msg) => {
          const { avatar, firstName, lastName, messages } = msg;
          return (
            <li
              className="inbox-user"
              key={Math.floor(Math.random() * 10000)}
              onClick={() => handleClick(messages)}
            >
              <img src={avatar} />
              <span>
                {firstName} {lastName}
              </span>
            </li>
          );
        })}
      </ul>
      <div>
        {messages?.map((msg) => (
          <p key={msg.timestamp}>{msg.content}</p>
        ))}
      </div>
    </div>
  );
}

export default Inbox;
