import Cookies from "js-cookie";
import "../../Assets/CSS/Feed.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfileIcon from "./ProfileIcon";
import HomeIcon from "./HomeIcon";

export default function Feed() {
  const [userToken, setUserToken] = useState(Cookies.get("ud"));

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsShown, setSearchResultsShown] = useState(false);

  const [feedPosts, setFeedPosts] = useState([]);
  const [isFiltered, setFiltered] = useState(false);
  function fetchPosts() {
    setFiltered(false);
    axios
      .get("https://react-blog-api-rvqux.ondigitalocean.app/feed/posts", {
        headers: {
          "x-access-token": userToken,
        },
      })
      .then((res) => {
        if (!res.data.auth && res.data.auth !== undefined) {
          Cookies.remove("ud")((window.location.href = "/auth"));
        } else {
          setFeedPosts(res.data.posts);
        }
      });
  }
  useEffect(() => {
    if (userToken === undefined) {
      window.location.href = "/auth";
    } else {
      //Find posts
      fetchPosts();
    }
  }, []);

  function searchPosts() {
    if (searchValue.length > 0) {
      setSearchResultsShown(true);
      axios
        .post(
          "https://react-blog-api-rvqux.ondigitalocean.app/search",
          { search: searchValue },
          { headers: { "x-access-token": userToken } }
        )
        .then((res) => {
          var results = res.data.results;
          if (results.length > 0) {
            setSearchResults(results);
          } else {
            setSearchResults([]);
            setSearchResults([{ title: "No Results Found!" }]);
          }
        });
    } else {
      setSearchResults([]);
      setSearchResultsShown(false);
    }
  }
  useEffect(() => {
    searchPosts();
  }, [searchValue]);
  function openTag(e, tag) {
    setFiltered(true);
    e.preventDefault();
    axios
      .post(
        "https://react-blog-api-rvqux.ondigitalocean.app/tag",
        { tag },
        { headers: { "x-access-token": userToken } }
      )
      .then((res) => {
        setFeedPosts(res.data.posts);
      });
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
        <div className="profile-icon-container">
          <ProfileIcon />
        </div>
        <div
          className="reset-feed-container"
          style={{ display: `${isFiltered ? "flex" : "none"}` }}
        >
          <span
            className="button-dark text-light new-post-btn"
            onClick={() => fetchPosts()}
          >
            Reset&nbsp;<i className="far fa-times"></i>
          </span>
        </div>
        <span></span>
        <div className="search-container bg-light text-dark">
          <input
            type="text"
            className="search-posts-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            spellCheck="false"
            autoComplete="off"
            placeholder="Search posts"
          />
          <span className="search-icon" onClick={() => searchPosts()}>
            <i className="far fa-search"></i>
          </span>
          <div
            className={`search-results ${
              searchResultsShown ? "show-search-results" : "hide-search-results"
            }`}
          >
            {searchResults.map((res) => {
              return (
                <Link to={`/post/view/${res.id}`} className="search-result">
                  <span className="search-result-title">{res.title}</span>
                  <span className="search-result-username">
                    @{res.username}
                  </span>
                  <span className="search-result-tag">{res.tag}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="posts-feed">
        {feedPosts.map((post) => {
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
                    onClick={(e) => openTag(e, post.tag)}
                  >
                    {post.tag}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
