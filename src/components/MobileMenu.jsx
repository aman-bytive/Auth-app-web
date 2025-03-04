import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbLayoutDashboardFilled, TbLogout } from "react-icons/tb";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // Get user data from localStorage
  const userName = localStorage.getItem("userName");
  const emailId = localStorage.getItem("emailId");
  const company = localStorage.getItem("company");
  const userId = localStorage.getItem("userId");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userName");
    localStorage.removeItem("emailId");
    localStorage.removeItem("company");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  return (
    <div
      style={{ background: "linear-gradient(to right, #000000, #0033FF)" }}
      className={`fixed top-0 right-0 z-50  bg-opacity-75 transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-full h-full p-4`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-semibold">Menu</h3>
        <IoMdClose
          className="h-8 w-8 p-2 rounded-full text-2xl text-white border-2 border-[#fff] flex justify-center items-center cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="flex flex-col mt-6">
        <Link
          to="/dashboard"
          className="text-white text-lg py-3 flex items-center gap-2"
          onClick={onClose}
        >
          <TbLayoutDashboardFilled className="text-[25px]" />
          Dashboard
        </Link>
        <div className="text-white text-lg py-3">
          <div className="flex items-center gap-2">
            <FaUser className="text-[25px]" />
            Profile
          </div>
          <ul className="mt-2">
            <li className="py-1 px-2">
              <strong>User Name: </strong>
              {userName || "Not Available"}
            </li>
            <li className="py-1 px-2">
              <strong>Company: </strong>
              {company || "Not Available"}
            </li>
            <li className="py-1 px-2">
              <strong>Email: </strong>
              {emailId || "Not Available"}
            </li>
            <li className="py-1 px-2">
              <strong>User ID: </strong>
              {userId || "Not Available"}
            </li>
          </ul>
          <div>
            <button
              onClick={handleLogout}
              className="mt-4 cursor-pointer text-white border border-white text-lg font-semibold flex items-center gap-2 px-2 rounded-lg"
            >
              Logout <TbLogout />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
