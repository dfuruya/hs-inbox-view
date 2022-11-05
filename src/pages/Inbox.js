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
        const conversation = { ...convo };
        const [mostRecentMessage] = convo.messages;
        const totalMessages = convo.messages.length;
        delete conversation["messages"];
        return { ...conversation, mostRecentMessage, totalMessages };
      });
      postInboxData({ conversations });
    }
  }, [inboxMap]);

  function handleClick(msgs) {
    // console.log(msgs);
    setMessages(msgs);
  }

  return (
    <div className="inbox-view">
      <ul className="inbox-left-panel">
        {inboxMap?.map((msg) => {
          const { avatar, firstName, lastName, messages, userId } = msg;
          return (
            <li
              className="inbox-user"
              key={userId}
              onClick={() => handleClick(messages)}
            >
              <img className="user-img" src={avatar} />
              <span>
                {firstName} {lastName[0]}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="inbox-right-panel">
        {messages?.map((msg) => {
          const { isSelf } = usersMap[msg.userId];
          const className = `msg-container msg-${isSelf ? "self" : "other"}`;
          return (
            <div className={className} key={msg.timestamp}>
              {msg.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inbox;
