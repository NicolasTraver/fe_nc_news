import { useState } from "react";

function UserInfo() {
  const [username] = useState(localStorage.getItem("username") || "grumpy19");

  return (
    <div className="user-info">
      <p>
        Hello, <strong>{username}</strong>
      </p>
    </div>
  );
}

export default UserInfo;
