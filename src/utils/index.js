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

      if (item) {
        // if already in "conversations"
        item["totalMessages"] = item["totalMessages"] + 1;
        msgMap.set(id, item);
      } else {
        msgMap.set(id, {
          avatar,
          firstName,
          lastName,
          mostRecentMessage: {
            content,
            timestamp,
            userId: fromUserId,
          },
          totalMessages: 1,
          userId: id,
        });
      }
    }
    return msgMap;
  }, new Map());

  return Array.from(messagesMap.values());
};
