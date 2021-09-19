import React, { useState, useEffect } from "react";
import HomeIcon from "./HomeIcon";
import ProfileIcon from "./ProfileIcon";

import "../../Assets/CSS/Profile.css";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Logout from "./Logout";
export default function Profile() {
  const token = Cookies.get("ud");
  if (token === undefined) {
    window.location.href = "/auth";
  }
  const [userPosts, setUserPosts] = useState([]);
  function getProfilePostDate(date) {
    var d = new Date(parseInt(date));
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = d.getDay() < 10 ? `0${d.getDay()}` : d.getDay();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const fullDate = `${month} ${day} ${year}`;
    return fullDate;
  }

  useEffect(() => {
    axios
      .get("https://react-blog-api-rvqux.ondigitalocean.app/user/profile", {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        setUserPosts(res.data.userPosts);
      });
  }, []);

  const deletePost = (postID, postUserName) => {
    axios
      .post(
        "https://react-blog-api-rvqux.ondigitalocean.app/post/delete/",
        { id: postID, username: postUserName },
        { headers: { "x-access-token": token } }
      )
      .then((res) => {
        setUserPosts(res.data.userPosts);
      });
  };
  function editPost(e) {
    window.location.href = `/edit/${e}`;
  }
  return (
    <>
      <div className="profile-icon-container">
        <ProfileIcon />
      </div>
      <Logout />
      <div className="home-icon-container">
        <HomeIcon />
      </div>
      <div className="profile-posts">
        <Grid container spacing={2}>
          {userPosts.map((user_post) => {
            return (
              <Grid item xs={6} sm={4} md={3}>
                <div
                  className="profile-post"
                  onClick={() =>
                    (window.location.href = `/post/view/${user_post.id}`)
                  }
                >
                  <span className="profile-post-header">
                    {user_post.title.length <= 22
                      ? user_post.title
                      : `${user_post.title.substring(0, 20)}...`}
                  </span>
                  <span className="profile-post-date">
                    {getProfilePostDate(user_post.created_at)}
                  </span>
                  <span
                    className="profile-post-tag"
                    style={{
                      display: `${
                        user_post.tag.length === 0 ? "none" : "block"
                      }`,
                    }}
                  >
                    {user_post.tag}
                  </span>
                  <span className="profile-post-body">
                    {user_post.body.length <= 22
                      ? user_post.body
                      : `${user_post.body.substring(0, 20)}...`}
                  </span>
                  <div className="profile-post-actions">
                    <Link
                      to={`/post/edit/${user_post.id}`}
                      className="profile-post-action edit-action"
                      // onClick={(e) => editPost(user_post.id)}
                    >
                      <i className="far fa-pencil-alt"></i> Edit
                    </Link>
                    &nbsp;
                    <button
                      className="profile-post-action delete-action"
                      onClick={() =>
                        deletePost(user_post.id, user_post.username)
                      }
                    >
                      <i className="far fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
}
