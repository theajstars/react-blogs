import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import "../../Assets/CSS/CreatePost.css";
import ProfileIcon from "./ProfileIcon";
export default function CreatePost() {
  const [token, setToken] = useState(Cookies.get("ud"));
  useEffect(() => {
    if (token === undefined) {
      window.location.href = "/auth";
    }
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const [postResponseDisplay, setPostResponseDisplay] = useState(false);
  const [postError, setPostError] = useState(false);
  const postResponseIconRef = useRef();
  const [postResponseText, setPostResponseText] = useState("");

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
      };
      axios
        .post("http://localhost:8080/create_post", post, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((res) => {
          console.clear();
          console.log(res);
          var published = res.data.published;
          if (published) {
            setPostResponseDisplay(true);
            setPostError(false);
            setPostResponseText("Your post has been published successfully");
            setTimeout(() => setPostResponseDisplay(false), 3000);
            // Fetch newly created post and display it

            setTimeout(
              () => (window.location.href = `/post/view/${res.data.postID}`),
              4000
            );
          } else {
            setPostResponseDisplay(true);
            setPostError(true);
            setPostResponseText("Your post could not be published");
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