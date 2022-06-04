import React from "react";
import "./Sidenav.css";
import logo from "../../../Images/mainlogo.svg";
import { MdOutlineAnalytics } from "react-icons/md";
import {
  IoNewspaperOutline,
  IoSettingsOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Sidenav({ active }) {
  return (
    <>
      <div
        className="side-nav d-flex flex-column vh-100 flex-shrink-0 p-3 text-white"
        style={{ width: "250px", position: "fixed", backgroundColor: "white" }}
      >
        <Link to="/">
          <div className="w-100 d-flex justify-content-center mt-4">
            <img src={logo} height="20px" alt="logo"></img>{" "}
          </div>
        </Link>

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
            >
              <IoNewspaperOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Posts</span>
            </Link>
          </li>
          <li>
            <Link to="/creator/transactions" className={`nav-link text-white ${
                active === "transactions" && "side-active"
              }`}>
              <RiMoneyDollarCircleLine style={{ color: "black" }} />
              <span className="ms-2 admin-link">Transactions</span>
            </Link>
          </li>
          <li>
            <Link to="/creator/settings" className={`nav-link text-white ${
                active === "settings" && "side-active"
              }`}>
              <IoSettingsOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
