import React, { useEffect, useState } from "react";
import * as api from "../../../api/admin";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiOutlineArrowRight } from "react-icons/ai";
import {
  Button,
  Modal,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BACKEND_URL } from "../../../constants/url";
import { Box } from "@mui/system";
import { ImPaypal } from "react-icons/im";
import LanguageIcon from "@mui/icons-material/Language";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallIcon from "@mui/icons-material/Call";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function ChannelsList() {
  const [status, setStatus] = useState("ALL");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelected] = useState(null);
  const dispatch = useDispatch();

  const SHOW = "SHOW_ADMIN_PROGRESS";
  const HIDE = "HIDE_ADMIN_PROGRESS";

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "#fff",
    boxShadow: 24,
    border: "none",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
  };

  useEffect(() => {
    channels.length = 0;
    setChannels([...channels]);
    loadChannel(0, 10, status);
  }, [status]);

  const loadChannel = async (skip, limit, status) => {
    let { data } = await api.fetchChannels(skip, limit, status);
    if (data?.channels) setChannels([...channels, ...data?.channels]);
    if (data?.message) alert(data?.message);
  };

  const handleLoadmore = async () => {
    loadChannel(
      parseInt(channels.length),
      parseInt(channels.length + 10),
      status
    );
  };

  const handleChange = (event, newStatus) => {
    setStatus(newStatus);
  };

  const handleBlock = async (id, isBlocked) => {
    dispatch({ type: SHOW });
    await api.blockChannel(id, isBlocked);
    channels.forEach((channel) => {
      if (channel._id === id) channel.isBlocked = isBlocked;
    });
    dispatch({ type: HIDE });
  };

  const handleApprove = async (id) => {
    dispatch({ type: SHOW });
    await api.approveChannel(id);
    channels.forEach((channel) => {
      if (channel._id === id) channel.isApproved = true;
    });
    dispatch({ type: HIDE });
  };

  return (
    <>
      <div className="content-end mt-3">
        <ToggleButtonGroup
          color="primary"
          style={{ backgroundColor: "white" }}
          value={status}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="ALL" className="show-post-toogle">
            ALL
          </ToggleButton>
          <ToggleButton value="APPROVED" className="show-post-toogle">
            APPROVED
          </ToggleButton>
          <ToggleButton value="PENDING" className="show-post-toogle">
            PENDING
          </ToggleButton>
          <ToggleButton value="BLOCKED" className="show-post-toogle">
            BLOCKED
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <TableContainer component={Paper} className="mt-1">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Blocked</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell className="id-row" scope="row">
                  <img
                    className="admin-channel-dp"
                    src={`${BACKEND_URL}/uploads/${row?.image}`}
                    alt=""
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.website}</TableCell>
                <TableCell>
                  <span
                    className={`admin-post-status ${
                      !row.isApproved && "status-review"
                    }`}
                  >
                    {row.isApproved ? "Approved" : "Pending Aprroval"}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={row.isBlocked}
                    color="warning"
                    onChange={(e) => handleBlock(row._id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    className="admin-view-more"
                    onClick={() => {
                      setSelected(row);
                      handleOpen();
                    }}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="content-center">
          <Button variant="text w-100 py-3" onClick={handleLoadmore}>
            Load more <AiOutlineArrowRight className="ms-2" />
          </Button>
        </div>
      </TableContainer>

      <div>
        <Modal
          open={open}
          onClose={() => {
            handleClose();
            setSelected(null);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <img
                className="admin-channel-dp me-2"
                src={`${BACKEND_URL}/uploads/${selectedChannel?.image}`}
                alt=""
              />{" "}
              {selectedChannel?.name}
            </Typography>

            <div className="mt-4">
              <p className="fw-500">
                <span className="settings-titles">
                  <PersonOutlineIcon className="f-15 me-2" />
                  UserId :
                </span>{" "}
                {selectedChannel?.userId}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <CallIcon className="f-15 me-2" />
                  Contact :
                </span>
                {selectedChannel?.phone}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <MailOutlineIcon className="f-15 me-2" />
                  Email :
                </span>
                {selectedChannel?.email}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <LanguageIcon className="f-15 me-2" />
                  Website :
                </span>
                {selectedChannel?.website}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <ImPaypal className="f-15 me-2" />
                  Payment address :
                </span>
                {selectedChannel?.paymentAccount}
              </p>

              <p className="fw-500">
                <span className="settings-titles">
                  <LanguageIcon className="f-15 me-2" />
                  Supporting files :
                </span>
              </p>

              <div className="mb-3">
                {selectedChannel?.supportFiles &&
                  selectedChannel.supportFiles.map((file) => {
                    return (
                      <div
                        className="support-files pointer ms-3"
                        onClick={() => {
                          window.open(
                            `${BACKEND_URL}/uploads/${file}`,
                            "_blank"
                          );
                        }}
                      >
                        {file}
                      </div>
                    );
                  })}
              </div>
            </div>

            {!selectedChannel?.isApproved && (
              <div className="content-end mt-5">
                <Button
                  className="delete-confirm-btn w-100"
                  onClick={() => handleApprove(selectedChannel?._id)}
                >
                  Approve
                </Button>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
}
