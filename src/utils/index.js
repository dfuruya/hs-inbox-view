export const formatUsers = (users) => {
  return users.reduce((userMap, user) => {
    userMap[user.id] = user;
    return userMap;
  }, {});
};

export const formatMessages = (msgs, usersMap) => {
  const messagesMap = msgs.reduce((msgMap, msg) => {
    const { fromUserId, toUserId, timestamp, content } = msg;
    const fromUser = usersMap[fromUserId];
    const toUser = usersMap[toUserId];

    if (fromUser && toUser) {
      // set 'user' as the 'other' user (not self)
      const user = fromUser.isSelf ? toUser : fromUser;

      const { id, avatar, firstName, lastName } = user;
      const item = msgMap.get(id);
      const msgToAdd = {
        content,
        timestamp,
        userId: fromUserId,
      };

      if (item) {
        // if already in "conversations"
        const msgs = [...item.messages, msgToAdd];
        msgMap.set(id, { ...item, messages: msgs });
      } else {
        msgMap.set(id, {
          avatar,
          firstName,
          lastName,
          messages: [
            {
              content,
              timestamp,
              userId: fromUserId,
            },
          ],
          userId: id,
        });
      }
    }
    return msgMap;
  }, new Map());

  return Array.from(messagesMap.values());
};

export const formatPostData = (inboxMap) => {
  return [...inboxMap].map((convo) => {
    const conversation = { ...convo };
    const [mostRecentMessage] = convo.messages;
    const totalMessages = convo.messages.length;
    delete conversation["messages"];
    return { ...conversation, mostRecentMessage, totalMessages };
  });
};
