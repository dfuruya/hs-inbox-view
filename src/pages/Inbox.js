import { useEffect, useState } from "react";
import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages } from "../utils";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();

  useEffect(() => {
    async function fetchMessages() {
      const { messages, users, userId } = await getMessages();

      const uMap = formatUsers(users);
      uMap[userId] = { id: userId, isSelf: true };
      setUsersMap(uMap);

      messages.sort((a, b) => b.timestamp - a.timestamp);
      // console.log(messages);
      const msgs = formatMessages(messages, usersMap);
      // console.log(msgs);
      setInboxMap(msgs);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (inboxMap?.length) {
      const data = {
        conversations: inboxMap,
      };
      postInboxData(data);
    }
  }, [inboxMap]);

  return (
    <ul>
      {inboxMap?.map((msg) => {
        const {
          mostRecentMessage,
          avatar,
          firstName,
          lastName,
          // totalMessages,
          userId,
        } = msg;
        return (
          <li key={userId}>
            <div>
              <img src={avatar} />
              <span>
                {firstName} {lastName}
              </span>
            </div>
            <div>{mostRecentMessage.content}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default Inbox;
