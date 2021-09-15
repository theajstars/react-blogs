import Cookies from "js-cookie";
import "../../Assets/CSS/Feed.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfileIcon from "./ProfileIcon";

export default function Feed() {
  const [userToken, setUserToken] = useState(Cookies.get("ud"));
  const [searchValue, setSearchValue] = useState("");
  const [feedPosts, setFeedPosts] = useState([]);
  const [postBody, setPostBody] = useState(
    "When the lions come and they turn to fight, will you lose your soul? Will you lose your pride?"
  );

  useEffect(() => {
    console.clear();
    if (userToken === undefined) {
      window.location.href = "/auth";
    } else {
      //Find posts
      axios
        .get("http://localhost:8080/feed/posts", {
          headers: {
            "x-access-token": userToken,
          },
        })
        .then((res) => {
          console.log(res);
          if (!res.data.auth && res.data.auth !== undefined) {
            Cookies.remove("ud")((window.location.href = "/auth"));
          } else {
            setFeedPosts(res.data.posts);
          }
        });
    }
  }, []);

  function searchPosts(e) {
    setSearchValue(e.target.value);
  }
  function openTag(e) {
    e.preventDefault();
  }
  function savePost(e) {
    e.preventDefault();
  }
  function getPostDate(date) {
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
  function getPostDuration(duration) {
    var newDuration;
    if (duration < 300) {
      newDuration = `${Math.floor(duration / 5)}s`;
    } else if (duration >= 300) {
      newDuration = `${Math.floor(duration / (5 * 60))}min`;
    }
    return newDuration;
  }
  return (
    <>
      <div className="feed-navbar">
        <Link to="/post/create" className="button-dark text-light new-post-btn">
          New Post&nbsp; <i className="fas fa-plus-circle"></i>
        </Link>

        <span></span>
        <div className="search-container bg-light text-dark">
          <input
            type="text"
            className="search-posts-input"
            value={searchValue}
            onChange={(e) => searchPosts(e)}
            spellCheck="false"
            autoComplete="off"
            placeholder="Search posts"
          />
          <span className="search-icon">
            <i className="far fa-search"></i>
          </span>
        </div>

        <ProfileIcon />
      </div>
      <div className="posts-feed">
        {feedPosts.map((post) => {
          console.log(post);
          return (
            <Link to={`/post/view/${post.id}`} className="post bg-light">
              <span className="post-author">{post.username}</span>
              <span className="post-title">{post.title}</span>
              <span className="post-body">
                {post.body.length < 100
                  ? post.body
                  : `${post.body.substring(0, 100)}...`}
              </span>

              <div className="post-bottom">
                <div className="post-details">
                  <span className="post-detail">
                    {getPostDate(post.created_at)}
                  </span>
                  <span className="post-detail">
                    {getPostDuration(post.duration)}
                  </span>
                  <span
                    className="post-detail post-tag"
                    style={{
                      display: `${post.tag.length === 0 ? "none" : "flex"}`,
                    }}
                    onClick={(e) => openTag(e)}
                  >
                    {post.tag}
                  </span>
                </div>
                <span
                  className="post-save-icon text-dark"
                  onClick={(e) => savePost(e)}
                >
                  <i className="far fa-bookmark"></i>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
