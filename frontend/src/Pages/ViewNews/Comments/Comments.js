import React, { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, postComment } from "../../../actions/postActions";
import { AiFillLock } from "react-icons/ai";
import noComment from "../../../Images/nocomments.jpg";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Button, CardHeader, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { BACKEND_URL } from "../../../constants/url";
import moment from "moment";

export default function Comments({ comments, id }) {
  const [typedComment, setTypedComment] = useState("");
  const [deleteId, setDeleteId] = useState();
  const { authUser: authData, selectedPost } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      postComment({
        comment: typedComment,
        postId: id,
      },setTypedComment)
    );

  };

  const isRecent = (date) => {
    var duration = moment.duration(date.diff(new Date()));
    var minute = duration.asMinutes()
    if(minute<=1) return true
    return false
  }

  return (
    <div id="comments" className="comment-card">
      <div className="card-head">
        Comments <span>({comments && comments.length})</span>
      </div>
      <div className="line"></div>
      <div className="comment-card-body card-body mx-3">
        {comments &&
          comments.map((val) => {
            return (
              <div
                className={`comment-item single-comment ${
                  val?.userId === authData.user?._id && "self-comment"
                }`}
              >

                <CardHeader
                  avatar={
                    <Avatar alt={val.username} 
                      src={val.userImage ? `${BACKEND_URL}/uploads/${val.userImage}` : null} 
                    />
                  }
                  title={val.username}
                  subheader={moment(val.date).format("ddd MMM DD YYYY hh:mm:ss")}
                />
                <div className="comment-text mb-2">{val.text}</div>

                {val?.userId === authData.user?._id && (
                  <>
                    <div className="comment-delete-holder d-flex w-25 justify-content-end">
                      {
                        (selectedPost?.deleteComment) && (deleteId===val?.commentId) ? 
                          <CircularProgress size={25} sx={{color:"#bb3131"}}/>
                        :<DeleteIcon className="delete-comment-btn pointer" onClick={() => {
                          setDeleteId(val.commentId)
                          dispatch(deleteComment(val));
                        }} />
                      }
                      
                      
                    </div>
                  </>
                )}
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
         {
            selectedPost?.details?.isComment 
            ?
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
              
              {selectedPost.commentLoading 
              ?
              <CircularProgress size={30} 
                sx={{color:"#70d44c"}}
                className="loading-cat-submit"
              />
              :<Button 
                variant="contained"
                className="comment-btn" 
                endIcon={<SendIcon />}
                style={!typedComment.length>0 ? {backgroundColor:"#d0d0d0"}:{backgroundColor:"#70d44c"}}
                disabled={!typedComment.length>0}
                onClick={()=>{

                  (typedComment.length>0) && handleSubmit()
                  
                }}
              >
              </Button>}
              
            </div>
          </div>
            </>
            :
            <>
            <div className="comment-footer">
            <div className="d-flex comment-login">
              <span className="desk-view d-flex">
                <p>
                  <CommentsDisabledIcon /> Commenting on this news post is turned off by admin.
                </p>
                </span>
            </div>
          </div>
            </>
          }
          
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
