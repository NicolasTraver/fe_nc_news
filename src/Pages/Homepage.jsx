import React from "react";
import { Link } from "react-router-dom";
import UserInfo from "../Components/UserInfo";
import Topics from "../Pages/Topics";

function Homepage() {
  return (
    <div className="homepage">
      <UserInfo />
      <h1>Welcome to Northcoders News</h1>
      <Topics />
      <p>Post, read, comment and contact other memebers!</p>
      <Link to="/articles">
        <button className="btn">View Posts</button>
      </Link>
    </div>
  );
}

export default Homepage;
