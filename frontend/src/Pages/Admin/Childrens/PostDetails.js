import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../../api/admin";
import { Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Switch,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AiOutlineEye } from "react-icons/ai";
import { BiLike, BiCommentDetail } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { GiClick } from "react-icons/gi";
import { BACKEND_URL } from "../../../constants/url";
import { useSnackbar } from "notistack";

function PostDetails() {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = useState({});
  const [category, setCat] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SHOW = "SHOW_ADMIN_PROGRESS";
  const HIDE = "HIDE_ADMIN_PROGRESS";

  useEffect(() => {
    fetchFullData(id);
  }, []);

  const fetchFullData = async (id) => {
    let { data } = await api.getFullDetails(id);
    setPost({ ...data?.post });
  };

  const handleDelete = async () => {
    try {
      dispatch({ type: SHOW });
      let { data } = await api.deletePost({
        deleteIDs: [id],
        deleteImages: post.images,
      });
      dispatch({ type: HIDE });
      if (data.status) {
        enqueueSnackbar(data.message, { variant: "success" });
        navigate("/admin/posts");
      } else enqueueSnackbar(data.message, { variant: "Error" });
    } catch (err) {
      dispatch({ type: HIDE });
      enqueueSnackbar(err.message, { variant: "Error" });
    }
  };

  const handleStatus = async () => {
    try {
      dispatch({ type: SHOW });
      let status = post.status === "PUBLIC" ? "REVIEW" : "PUBLIC";
      let { data } = await api.updatePostStatus(id, status);
      dispatch({ type: HIDE });
      if (data.status) {
        enqueueSnackbar(data.message, { variant: "success" });
        setPost((prev) => ({ ...prev, status: status }));
      } else enqueueSnackbar(data.message, { variant: "Error" });
    } catch (err) {
      dispatch({ type: HIDE });
      enqueueSnackbar(err.message, { variant: "Error" });
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col xl={8}>
            <Card className="mb-2 news-text-card">
              <Card.Body className="ms-0">
                <p className="post-details-titles">Title</p>
                <p>{post?.newsHead}</p>

                <p className="post-details-titles mt-3 mb">Body</p>
                <p>
                  <pre className="news-body">{post?.newsBody}</pre>
                </p>
              </Card.Body>
            </Card>

            <Card className="mb-3 news-text-card p-1">
              <Card.Body className="ms-0">
                <p className="dash-card-heading">
                  Media ({post?.images && post?.images.length})
                </p>
                <Row>
                  {post?.images &&
                    post?.images.map((val) => {
                      return (
                        <Col lg={4}>
                          <img
                            src={`${BACKEND_URL}/uploads/${val}`}
                            width="100%"
                            alt=""
                          />
                        </Col>
                      );
                    })}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4}>
            <Card className="mb-3">
              <Card.Body className="ms-0">
                <p className="dash-card-heading">Interactions</p>
                <p className="ms-3">
                  <AiOutlineEye className="me-2" />
                  Total number of Views:{" "}
                  <span className="fw-500 f-17 ms-2">{post?.views}</span>
                </p>
                <p className="ms-3">
                  <BiLike className="me-2" />
                  Total number of Likes:{" "}
                  <span className="fw-500 f-17 ms-2">{post?.likes}</span>
                </p>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="ms-0">
                <p className="dash-card-heading">Category</p>
                <>
                  <div className="mt-3">
                    {post?.category &&
                      post?.category.map((val, index) => {
                        return (
                          <span key={index} className="selected-cat mb-2">
                            {val}{" "}
                          </span>
                        );
                      })}
                  </div>
                </>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="ms-0">
                <p className="dash-card-heading">Actions</p>
                <>
                  <div className="mt-3">
                    <span className="ms-3">Post status:</span>
                    <Switch
                      onChange={handleStatus}
                      checked={post?.status === "PUBLIC"}
                    />
                    <span className="fw-500">
                      {post?.status === "PUBLIC" ? "Published" : "In Review"}
                    </span>
                    <p className="mb-0 mt-3">
                      <Button
                        className="post-delete-btn w-100"
                        onClick={() => {
                          handleOpen();
                        }}
                      >
                        Delete Post
                      </Button>
                    </p>
                  </div>
                </>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <DeleteIcon />
          {" Are you use to perform deletion?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mt-4">
            You are about to delete. Enter "delete" to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PostDetails;
