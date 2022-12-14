import { useEffect, useState } from "react";

import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages, formatPostData } from "../utils";

import User from "../components/User";
import Message from "../components/Message";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();
  const [selectedUserIx, setSelectedUserIx] = useState([]);

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

  useEffect(() => {
    if (inboxMap?.length) {
      const conversations = formatPostData(inboxMap);
      postInboxData({ conversations });
    }
  }, [inboxMap]);

  function handleSelectUser(inboxIx) {
    setSelectedUserIx(inboxIx);
  }

  return (
    <div className="inbox-view">
      <ul className="inbox-left-panel">
        {inboxMap?.map((convo, ix) => (
          <User
            user={convo}
            isSelected={ix === selectedUserIx}
            handleSelectUser={() => handleSelectUser(ix)}
          />
        ))}
      </ul>
      <div className="inbox-right-panel">
        {inboxMap?.[selectedUserIx]?.messages.map((msg) => (
          <Message message={msg} isSelf={usersMap?.[msg.userId]?.isSelf} />
        ))}
      </div>
    </div>
  );
}

export default Inbox;
