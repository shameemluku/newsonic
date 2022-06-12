import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Sidenav.css";
import logo from "../../../Images/mainlogo.svg";
import { MdOutlineAnalytics } from "react-icons/md";
import {
  IoNewspaperOutline,
  IoSettingsOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function SideMobile({ open, closeSide, active }) {
  const drawerWidth = 270;
  const theme = useTheme();

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  }));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div
        className="side-mob-nav d-flex flex-column vh-100 flex-shrink-0 p-3 text-white"
        style={{ width: "250px", position: "fixed", backgroundColor: "white" }}
      >
        <div
          className="w-100 pointer"
          style={{ color: "black" }}
          onClick={() => closeSide()}
        >
          <ArrowForwardIosIcon />
        </div>

        <div className="w-100 d-flex justify-content-center mt-4">
          <Link to="/" onClick={() => closeSide()}>
            <img src={logo} height="20px" alt="logo"></img>{" "}
          </Link>
        </div>

        <div className="w-100 d-flex justify-content-center">
          <Link to="/creator/add" className="add-btn text-center">
            <IoAddCircleOutline className="me-2" style={{ fontSize: "20px" }} />
            Add news
          </Link>
        </div>

        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link
              to="/creator/"
              className={`nav-link text-white ${
                active === "analytics" && "side-active"
              }`}
              onClick={() => closeSide()}
            >
              <MdOutlineAnalytics style={{ color: "black" }} />
              <span className="ms-2 admin-link">Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              to="/creator/posts"
              className={`nav-link text-white ${
                active === "posts" && "side-active"
              }`}
              onClick={() => closeSide()}
            >
              <IoNewspaperOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Posts</span>
            </Link>
          </li>
          <li>
            <Link
              to="/creator/transactions"
              className={`nav-link text-white ${
                active === "transactions" && "side-active"
              }`}
              onClick={() => closeSide()}
            >
              <RiMoneyDollarCircleLine style={{ color: "black" }} />
              <span className="ms-2 admin-link">Transactions</span>
            </Link>
          </li>
          <li>
            <Link
              to="/creator/settings"
              className={`nav-link text-white ${
                active === "settings" && "side-active"
              }`}
              onClick={() => closeSide()}
            >
              <IoSettingsOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      <Divider />
    </Drawer>
  );
}

export default SideMobile;
