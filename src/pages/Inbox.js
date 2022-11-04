import { useEffect, useState } from "react";
import { getMessages, postInboxData } from "../api";
import { formatUsers, formatMessages } from "../utils";

function Inbox() {
  const [usersMap, setUsersMap] = useState({});
  const [inboxMap, setInboxMap] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      const { messages, users, userId } = await getMessages();

      const uMap = formatUsers(users);
      uMap[userId] = { id: userId, isSelf: true };
      setUsersMap(uMap);

      messages.sort((a, b) => b.timestamp - a.timestamp);
      const msgs = formatMessages(messages, usersMap);
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

  function handleClick(text) {
    console.log(text);
    setMessage(text);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ul>
          {inboxMap?.map((msg) => {
            const { mostRecentMessage, avatar, firstName, lastName } = msg;
            return (
              <li
                key={Math.floor(Math.random() * 10000)}
                onClick={() => handleClick(mostRecentMessage.content)}
              >
                <div>
                  <img src={avatar} />
                  <span>
                    {firstName} {lastName}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div>{message}</div>
    </>
  );
}

export default Inbox;
