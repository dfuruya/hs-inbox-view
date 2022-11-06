function User({ user, isSelected, handleSelectUser }) {
  const { avatar, firstName, lastName, userId } = user;
  const className = `inbox-user ${isSelected ? "user-selected" : ""}`;
  return (
    <li className={className} key={userId} onClick={handleSelectUser}>
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
}

export default User;
