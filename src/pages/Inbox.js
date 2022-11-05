import { useEffect, useState } from "react";
import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages } from "../utils";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();
  const [selectedUserIx, setSelectedUserIx] = useState([]);

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

  function handleClick(inboxIs) {
    setSelectedUserIx(inboxIs);
  }

  return (
    <div className="inbox-view">
      <ul className="inbox-left-panel">
        {inboxMap?.map((convo, ix) => {
          const { avatar, firstName, lastName, userId } = convo;
          const isSelected = selectedUserIx === ix;
          const className = `inbox-user ${isSelected ? "user-selected" : ""}`;
          return (
            <li
              className={className}
              key={userId}
              onClick={() => handleClick(ix)}
            >
              <img
                className="user-img"
                src={avatar}
                onError={(e) => {
                  e.target.src = "/user-svgrepo-com.svg"; // some replacement image
                  // e.target.style = "padding: 8px; margin: 16px"; // inline styles in html format
                }}
              />
              <span>
                {firstName} {lastName[0]}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="inbox-right-panel">
        {inboxMap?.[selectedUserIx]?.messages.map((msg) => {
          const { userId, timestamp, content } = msg;
          const { isSelf } = usersMap[userId];
          const className = `msg-container msg-${isSelf ? "self" : "other"}`;
          return (
            <div className={className} key={timestamp}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inbox;
