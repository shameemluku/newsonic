import React, { useEffect, useState } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../../actions/postActions";
import { AiFillLock } from "react-icons/ai";
import noComment from "../../../Images/nocomments.jpg";

export default function Comments({ comments, id }) {
  const [typedComment, setTypedComment] = useState();
  const { authUser: authData } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log(typedComment + " " + id);
    dispatch(
      postComment({
        comment: typedComment,
        postId: id,
      })
    );
  };

  return (
    <div className="comment-card">
      <div className="card-head">
        Comments <span>({comments && comments.length})</span>
      </div>
      <div className="line"></div>
      <div className="card-body">
        {comments &&
          comments.map((val) => {
            return (
              <div className="comment-item d-flex">
                <img
                  className="comment-dp"
                  src="https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
                  alt=""
                ></img>
                <div className="ms-3">
                  <div className="comment-name">{val.username}</div>
                  <div className="comment-date">{val.date}</div>
                  <div className="comment-text mb-2">{val.text}</div>
                </div>
              </div>
            );
          })}

        {comments && comments?.length === 0 && (
          <>
            <div className="w-100 no-comments">
              <img src={noComment} draggable="false"></img>
            </div>
            <p className="content-center no-comment-text m-0">
              No comments yet
            </p>
            <p className="content-center no-comment-desc">
              Be the first one comment on this post
            </p>
          </>
        )}
      </div>
      {authData.user !== null ? (
        <>
          <div className="comment-footer">
            <div className="d-flex comment-type">
              <input
                type="text"
                className="w-100"
                placeholder="Post your comments here"
                value={typedComment || ""}
                onChange={(e) => {
                  setTypedComment(e.target.value);
                }}
              />
              <RiSendPlane2Fill
                size={"35px"}
                className={"send-btn"}
                onClick={() => handleSubmit()}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="comment-footer">
            <div className="d-flex comment-login">
              <span className="desk-view d-flex">
              <p>
                <AiFillLock /> Please login first to post comments.
              </p>
              <span
                className="comment-login-btn"
                onClick={() => {
                  dispatch({ type: "SHOW_MODAL", payload: true });
                }}
              >
                Login here
              </span>
              </span>

              <span
                className="comment-login-btn mobile-only d-none"
                onClick={() => {
                  dispatch({ type: "SHOW_MODAL", payload: true });
                }}
              >
               <AiFillLock /> Login here
              </span>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
