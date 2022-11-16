import { useEffect, useState, useRef } from "react";

import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages, formatPostData } from "../utils";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

import User from "../components/User";
import Message from "../components/Message";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();
  const [selectedUserIx, setSelectedUserIx] = useState([]);
  // const rootRef = useRef();

  useEffect(() => {
    fetchMessages();

    async function fetchMessages() {
      const { messages, users, userId } = await getMessages();

      const uMap = formatUsers(users);
      uMap[userId] = { id: userId, isSelf: true };
      setUsersMap(uMap);

      messages.sort((a, b) => b.timestamp - a.timestamp);
      const msgs = formatMessages(messages, uMap);
      setInboxMap(msgs);
    }
  }, []);

  useIntersectionObserver({
    root: document.querySelector(".scroll-overlay"),
    items: inboxMap,
  });

  function handleSelectUser(inboxIx) {
    setSelectedUserIx(inboxIx);
  }

  return (
    <div className="inbox-view">
      <div className="inbox-left-container">
        <div className="scroll-overlay" />
        <ul className="inbox-left-panel">
          {inboxMap?.map((convo, ix) => (
            <User
              user={convo}
              isSelected={ix === selectedUserIx}
              handleSelectUser={() => handleSelectUser(ix)}
            />
          ))}
        </ul>
      </div>
      <div className="inbox-right-panel">
        {inboxMap?.[selectedUserIx]?.messages.map((msg) => (
          <Message message={msg} isSelf={usersMap?.[msg.userId]?.isSelf} />
        ))}
      </div>
    </div>
  );
}

export default Inbox;
