import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import "../../Assets/CSS/ViewPost.css";
import HomeIcon from "./HomeIcon";
import ProfileIcon from "./ProfileIcon";
export default function ViewPost() {
  const token = Cookies.get("ud");
  const [postPath, setPostPath] = useState(null);
  const [post, setPost] = useState({
    body: "",
    title: "",
    created_at: "",
    duration: "",
    id: "",
    tag: "",
    username: "",
  });
  const [isPostSaved, setPostSavedStatus] = useState(false);
  const [isPostLiked, setPostLikedStatus] = useState(false);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(false);
  if (token === undefined) {
    window.location.href = "/auth";
  }
  useEffect(() => {
    var path = new URL(window.location.href);
    var postID = path.pathname.substring(
      path.pathname.lastIndexOf("/") + 1,
      path.pathname.length
    );
    console.log("Post ID: ", parseInt(postID));
    if (isNaN(postID)) {
      window.location.href = "/feed";
      console.error("Invalid id: ", postID);
    } else {
      setPostPath(postID);
      axios
        .get(`http://localhost:8080/post/view/${postID}`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          console.log(res);
          setPost(res.data.post);
          setComments(res.data.comments);
        });
      axios
        .get(`http://localhost:8080/post_user/${postID}`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          console.log(res);
          if (res.data.post.saved.length > 0) {
            setPostSavedStatus(true);
          } else {
            setPostSavedStatus(false);
          }

          if (res.data.post.liked.length > 0) {
            setPostLikedStatus(true);
          } else {
            setPostLikedStatus(false);
          }
        });
    }
  }, []);

  function toggleLikePost() {
    setPostLikedStatus(!isPostLiked);

    axios
      .get(`http://localhost:8080/post/toggle_like/${postPath}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        console.log(res);
      });
  }
  function toggleSavePost() {
    setPostSavedStatus(!isPostSaved);
    axios
      .get(`http://localhost:8080/post/toggle_save/${postPath}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        console.log(res);
      });
  }

  function publishComment() {
    if (comment.length === 0) {
      setCommentError(true);
    } else {
      setCommentError(false);
    }
    axios
      .post(
        `http://localhost:8080/comment/${postPath}`,
        { comment: comment },
        { headers: { "x-access-token": token } }
      )
      .then((res) => {
        console.log(res);
        if (res.data.commented) {
          //Comment has been stored successfully
          const commentOBJ = {
            comment: comment,
            username: res.data.comment.username,
            comment_date: res.data.comment.comment_date,
          };
          setComments([...comments, commentOBJ]);
          setComment("");
        }
      });
  }
  function getCommentDate(commentDate) {
    var d = new Date(parseInt(commentDate));
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
    if (commentError && comment.length > 0) {
      setCommentError(false);
    }
  }, [comment]);
  return (
    <>
      <div className="profile-icon-container">
        <ProfileIcon />
      </div>
      <div className="home-icon-container">
        <HomeIcon />
      </div>
      <div className="post-container">
        <div className="post-shadow">
          <div className="view-post-title">{post.title}</div>
          <div className="view-post-body">
            {post.body}
            <div className="post-actions">
              <span className="post-action" onClick={() => toggleLikePost()}>
                <i className={`${isPostLiked ? "fas" : "far"} fa-heart`}></i>
              </span>
              <span className="post-action" onClick={() => toggleSavePost()}>
                <i className={`${isPostSaved ? "fas" : "far"} fa-bookmark`}></i>
              </span>
            </div>
          </div>
        </div>
        <div
          className={`create-comment-container ${
            commentError ? "comment-error" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Leave a comment"
            className={`create-comment`}
            spellCheck="false"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <span className="publish-comment" onClick={() => publishComment()}>
            <i className="fas fa-paper-plane"></i>
          </span>
        </div>
        <div className="post-comments">
          {comments.map((comment) => {
            return (
              <div className="post-comment">
                <span className="commentator">{comment.username}</span>
                <p className="commentary">{comment.comment}</p>
                <span className="comment-date">
                  {getCommentDate(comment.comment_date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
