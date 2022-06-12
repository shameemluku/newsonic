import React from "react";
import * as api from "../../../api/admin";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ADMIN_SIGNOUT } from "../../../constants/actionTypes";

import {
  IoNewspaperOutline,
  IoSettingsOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import {
  RiAdvertisementLine,
  RiMoneyDollarCircleLine,
  RiPaypalLine,
} from "react-icons/ri";
import { MdOutlineAnalytics } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrChannel } from "react-icons/gr";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../../Images/mainlogo.svg";
import "./Components.css";

export default function Sidenav({ active }) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await api.logoutAdmin()
    dispatch({
      type: ADMIN_SIGNOUT,
    });
    navigate('/admin')
  }

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

        <ul className="nav nav-pills flex-column mb-auto mt-5">
          <li>
            <Link
              to="/admin/"
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
              to="/admin/posts"
              className={`nav-link text-white ${
                active === "posts" && "side-active"
              }`}
            >
              <IoNewspaperOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Posts</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/users"
              className={`nav-link text-white ${
                active === "users" && "side-active"
              }`}
            >
              <FiUsers style={{ color: "black" }} />
              <span className="ms-2 admin-link">Users</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/channels"
              className={`nav-link text-white ${
                active === "channels" && "side-active"
              }`}
            >
              <GrChannel style={{ color: "black" }} />
              <span className="ms-2 admin-link">Channels</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/ads"
              className={`nav-link text-white ${
                active === "ads" && "side-active"
              }`}
            >
              <RiAdvertisementLine style={{ color: "black" }} />
              <span className="ms-2 admin-link">Ads</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/payouts"
              className={`nav-link text-white ${
                active === "payouts" && "side-active"
              }`}
            >
              <RiPaypalLine style={{ color: "black" }} />
              <span className="ms-2 admin-link">Payouts</span>
            </Link>
          </li>

          <li>
            <Link
              to=""
              className={`nav-link text-white`}
              onClick={handleLogout}
            >
              <LogoutIcon style={{ color: "black" }} />
              <span className="ms-2 admin-link">Logout</span>
            </Link>
          </li>

          {/* <li>
            <Link to="/admin" className={`nav-link text-white ${
                active === "transactions" && "side-active"
              }`}>
              <RiMoneyDollarCircleLine style={{ color: "black" }} />
              <span className="ms-2 admin-link">Transactions</span>
            </Link>
          </li>
          <li>

            <Link to="/admin" className={`nav-link text-white ${
                active === "settings" && "side-active"
              }`}>
              <IoSettingsOutline style={{ color: "black" }} />
              <span className="ms-2 admin-link">Settings</span>
            </Link>
          </li> */}
        </ul>
      </div>
    </>
  );
}
