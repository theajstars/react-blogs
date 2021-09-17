import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import "../../Assets/CSS/CreatePost.css";
import HomeIcon from "./HomeIcon";
import ProfileIcon from "./ProfileIcon";

export default function EditPost() {
  const [token, setToken] = useState(Cookies.get("ud"));
  useEffect(() => {
    if (token === undefined) {
      window.location.href = "/auth";
    }
  });

  const [postPath, setPostPath] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [username, setUsername] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const [postResponseDisplay, setPostResponseDisplay] = useState(false);
  const [postError, setPostError] = useState(false);
  const postResponseIconRef = useRef();
  const [postResponseText, setPostResponseText] = useState("");

  useEffect(() => {
    var path = new URL(window.location.href);
    var postID = path.pathname.substring(
      path.pathname.lastIndexOf("/") + 1,
      path.pathname.length
    );
    if (isNaN(postID)) {
      window.location.href = "/feed";
    } else {
      setPostPath(postID);
      axios
        .get(`http://localhost:8080/post/view/${postID}`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          var fetchedPost = res.data.post;
          setTitle(fetchedPost.title);
          setContent(fetchedPost.body);
          setTag(fetchedPost.tag);
          setUsername(fetchedPost.username);
        });
    }
  }, []);
  useEffect(() => {
    postError
      ? (postResponseIconRef.current.innerHTML =
          "<i class='far fa-exclamation-circle'></i>")
      : (postResponseIconRef.current.innerHTML =
          "<i class='fas fa-check-circle'></i>");
  }, [postError]);
  function publishPost() {
    if (content.length === 0) {
      setContentError(true);
    } else {
      setContentError(false);
    }
    if (title.length === 0) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (title.length > 0 && content.length > 0) {
      const post = {
        title: title,
        content: content,
        tag: tag,
        username: username,
        postID: postPath,
      };
      axios
        .post("http://localhost:8080/post/update", post, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((res) => {
          var published = res.data.updated;
          if (published) {
            setPostResponseDisplay(true);
            setPostError(false);
            setPostResponseText("Your post has been updated successfully");
            setTimeout(() => setPostResponseDisplay(false), 1000);
            // Fetch newly created post and display it

            setTimeout(
              () => (window.location.href = `/post/view/${res.data.postID}`),
              1200
            );
          } else {
            setPostResponseDisplay(true);
            setPostError(true);
            setPostResponseText("Your post could not be updated!");
            setTimeout(() => setPostResponseDisplay(false), 3000);
          }
        });
    }
  }
  return (
    <>
      <div
        className={`post-response ${
          postResponseDisplay ? "show-response" : "hide-response"
        }`}
      >
        <span
          className={`post-response-icon ${
            postError ? "error-icon" : "success-icon"
          }`}
          ref={postResponseIconRef}
        ></span>
        <p className="response-text">{postResponseText}</p>
      </div>
      <div className="home-icon-container">
        <HomeIcon />
      </div>
      <div className="profile-icon-container">
        <ProfileIcon />
      </div>
      <div className="post-form-container">
        <div className="post-form">
          <input
            type="text"
            placeholder="Title"
            className={`post-input title-input ${
              titleError ? "input-error" : ""
            }`}
            spellCheck={false}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (title.length > 0) {
                setTitleError(false);
              }
            }}
          />
          <textarea
            placeholder="Post content"
            className={`post-input body-input ${
              contentError ? "input-error" : ""
            }`}
            spellCheck={false}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (content.length > 0) {
                setContentError(false);
              }
            }}
          ></textarea>
          <div className="post-form-bottom">
            <input
              className="add-tag"
              placeholder="Add tag"
              spellCheck={false}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button
              className="new-post-btn text-light button-dark"
              onClick={() => publishPost()}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
