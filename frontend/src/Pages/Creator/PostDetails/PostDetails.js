import React, { useEffect, useState } from "react";
import { Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getFullDetails,
  updatePostCategory,
  updatePostIsComment,
  updatePostIsMonetize,
  updatePostText,
} from "../../../actions/channelActions";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import "./PostDetails.css";
import {
  Button,
  CircularProgress,
  LinearProgress,
  Switch,
  TextField,
} from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { BiLike, BiCommentDetail } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { GiClick } from "react-icons/gi";
import Autocomplete from "../Addnews/Autocomplete";
import { getCategory } from "../../../api";
import { BACKEND_URL } from "../../../constants/url";
import { useSnackbar } from "notistack";

function PostDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { creatorSelectedPost } = useSelector((state) => state);
  const [post, setPost] = useState({});
  const [isEditable, setEditable] = useState(false);
  const [isCatEditable, setCatEditable] = useState(false);
  const [category, setCat] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUpdateBtn, setUpdateBtn] = useState(false);
  const [showCatUpdateBtn, setCatUpdateBtn] = useState(false);
  const [editedTexts, setEditedTexts] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    dispatch(getFullDetails(id));
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    let { data } = await getCategory();
    setCategories([
      ...data.categories.map((val) => {
        return val.name;
      }),
    ]);
  };

  function changeCat(cat) {
    let f = 0;
    category.map((val) => {
      if (val === cat) {
        f = 1;
      }
    });

    if (f !== 1) {
      setCat([...category, cat]);
      setCatUpdateBtn(true);
    }
  }

  function deleteCat(index) {
    let newCat = category.filter((val, i) => {
      if (index !== i) {
        return val;
      }
    });

    setCat(newCat);
    setCatUpdateBtn(true);
  }

  useEffect(() => {
    if (creatorSelectedPost.post !== null) {
      setPost({ ...creatorSelectedPost.post });
      setCat([...creatorSelectedPost.post?.category]);
    }
  }, [creatorSelectedPost]);

  useEffect(() => {
    if (isEditable) {
      setEditedTexts({
        ...editedTexts,
        title: post?.newsHead,
        body: post?.newsBody,
      });
    }
  }, [isEditable]);

  useEffect(() => {
    if (
      editedTexts.title !== post?.newsHead ||
      editedTexts.body !== post?.newsBody
    ) {
      setUpdateBtn(true);
    } else setUpdateBtn(false);
  }, [editedTexts]);

  const updateData = () => {
    dispatch(
      updatePostText(
        {
          postId: post._id,
          title: editedTexts.title,
          body: editedTexts.body,
        },
        showToast
      )
    );
  };

  const updateCategory = () => {
    dispatch(
      updatePostCategory(
        {
          postId: post._id,
          category,
        },
        showToast
      )
    );
  };

  const updateIsComment = (e) => {
    setPost({ ...post, isComment: e.target.checked });
    dispatch(
      updatePostIsComment(
        {
          postId: post._id,
          isComment: e.target.checked,
        },
        showToast
      )
    );
  };

  const updateIsMonetize = (e) => {
    setPost({ ...post, isComment: e.target.checked });
    dispatch(
      updatePostIsMonetize(
        {
          postId: post._id,
          isMonetize: e.target.checked,
        },
        showToast
      )
    );
  };

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
    setCatEditable(false);
    setEditable(false);
  };

  return (
    <>
      <Container>
        <Row>
          <Col xl={8}>
            <Card className="mb-2 news-text-card">
              <Card.Body className="ms-0">
                {isEditable ? (
                  <CancelIcon
                    className="post-edit-btn"
                    onClick={() => {
                      setEditable(false);
                    }}
                  />
                ) : (
                  <EditIcon
                    className="post-edit-btn"
                    onClick={() => {
                      setEditable(true);
                    }}
                  />
                )}

                <p className="post-details-titles">Title</p>
                {!isEditable ? (
                  <p>{post?.newsHead}</p>
                ) : (
                  <input
                    className="edit-head-input"
                    value={editedTexts?.title}
                    type={"text"}
                    onChange={(e) => {
                      setEditedTexts((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }));
                    }}
                  ></input>
                )}

                <p className="post-details-titles mt-3 mb">Body</p>
                {!isEditable ? (
                  <p>
                    <pre className="news-body">{post?.newsBody}</pre>
                  </p>
                ) : (
                  <textarea
                    className="edit-head-body"
                    value={editedTexts?.body}
                    type={"text"}
                    onChange={(e) => {
                      setEditedTexts((prevState) => ({
                        ...prevState,
                        body: e.target.value,
                      }));
                    }}
                  ></textarea>
                )}

                {showUpdateBtn && isEditable && (
                  <p className="text-end mb-0">
                    {creatorSelectedPost.loading ? (
                      <>
                        <CircularProgress
                          className="mt-2"
                          color="success"
                          size={26}
                        />
                      </>
                    ) : (
                      <Button onClick={updateData}>Update</Button>
                    )}
                  </p>
                )}
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

                <div className="comment-stats px-3 py-3">
                  <p className="mb-1 ms-1">
                    <BiCommentDetail className="me-2" />
                    Total Comments:{" "}
                    <span className="fw-500 f-17 ms-2">
                      {post?.comments?.length}
                    </span>
                    <Button className="comment-view-btn ms-4">View all</Button>
                  </p>
                  <span className="ms-1">Comment status:</span>
                  <Switch
                    onChange={updateIsComment}
                    checked={post?.isComment}
                  />
                  <span className="fw-500">
                    {post?.isComment ? "enabled" : "disabled"}
                  </span>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="ms-0">
                {isCatEditable ? (
                  <CancelIcon
                    className="post-edit-btn"
                    onClick={() => {
                      setCat(post?.category);
                      setCatEditable(false);
                      setCatUpdateBtn(false);
                    }}
                  />
                ) : (
                  <EditIcon
                    className="post-edit-btn"
                    onClick={() => {
                      setCatEditable(true);
                    }}
                  />
                )}
                <p className="dash-card-heading">Category</p>
                {!isCatEditable ? (
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
                ) : (
                  <>
                    <Autocomplete options={categories} changeCat={changeCat} />
                    <div className="mt-3">
                      {category.map((val, index) => {
                        return (
                          <span key={index} className="selected-cat mb-2">
                            {val}{" "}
                            <IoCloseSharp
                              className="close-cat mx-1"
                              onClick={() => {
                                deleteCat(index);
                              }}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}

                {showCatUpdateBtn && isCatEditable && category.length !== 0 && (
                  <p className="text-end mb-0">
                    {creatorSelectedPost.loading ? (
                      <>
                        <CircularProgress
                          className="mt-2"
                          color="success"
                          size={26}
                        />
                      </>
                    ) : (
                      <Button onClick={updateCategory}>Update</Button>
                    )}
                  </p>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body className="ms-0">
                <p className="dash-card-heading">Analytics</p>

                <span className="ms-3">Monetization status:</span>
                <Switch
                  onChange={updateIsMonetize}
                  checked={post?.isMonetize}
                />
                <span className="fw-500">
                  {post?.isMonetize ? "enabled" : "disabled"}
                </span>

                <p className="ms-3 mt-3 mb-0">
                  <AiOutlineEye className="me-2" />
                  Cost per Impression:{" "}
                  <span className="fw-500 f-17 ms-2">
                    ₹ {post?.revenue?.CPI ? post?.revenue?.CPI : "0"}
                  </span>
                </p>
                <p className="ms-3">
                  <GiClick className="me-2" />
                  Cost per Click:{" "}
                  <span className="fw-500 f-17 ms-2">
                    ₹ {post?.revenue?.CPC ? post?.revenue?.CPC : "0"}
                  </span>
                </p>
                <p className="mb-0 mt-2 text-end post-total">
                  Total Earnings{" "}
                  <span className="post-total-span">
                    ₹ {post?.revenue?.total ? post?.revenue?.total : "0.00"}
                  </span>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PostDetails;
