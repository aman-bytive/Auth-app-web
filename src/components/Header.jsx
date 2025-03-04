import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import CreateDevicePopUp from "./CreateDevicePopUp";
import MobileMenu from "./MobileMenu";
import { TbLogout, TbMenu3 } from "react-icons/tb";

const Header = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const userName = localStorage.getItem("userName");
  const emailId = localStorage.getItem("emailId");
  const company = localStorage.getItem("company");
  const userId = localStorage.getItem("userId");

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userName");
    localStorage.removeItem("emailId");
    localStorage.removeItem("company");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#004E72] text-white py-3 px-6 flex justify-between items-center relative">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img src="/vite.svg" alt="MGCO Legal" className="h-10" />{" "}
          <nav className="hidden md:flex gap-6 text-white">
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4 relative">
          <button className=" text-[#fff] px-4 py-2 rounded-md font-medium">
            {emailId || "Email"}
          </button>
          <button className="bg-white text-[#004E72] px-4 py-2 rounded-md font-medium">
            {userName || "User Name"}
          </button>
          <div className="relative">
            <div
              sx={{
                fontSize: "1.2rem",
                transform: "translateY(-50%)",
              }}
              style={{
                background: "linear-gradient(to right, #0033FF, #000000)",
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
              className="h-10 w-10 rounded-full  text-white border-2 border-[#fff] flex justify-center items-center cursor-pointer"
              onClick={togglePopup}
              onMouseEnter={togglePopup}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Profile Pop-up */}
            {showPopup && (
              <div
                ref={popupRef}
                className="absolute top-14 right-0 bg-white text-[#004E72] rounded-md shadow-md w-[250px] p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Profile</h3>
                  <button
                    className="text-xl cursor-pointer"
                    onClick={() => setShowPopup(false)}
                  >
                    <IoMdClose />
                  </button>
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
                    className="mt-4 cursor-pointer text-black border border-black text-lg font-semibold flex items-center gap-2 px-2 rounded-lg"
                  >
                    Logout <TbLogout />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Burger Menu for Mobile */}
        <div className="block md:hidden" onClick={toggleMenu}>
          <TbMenu3 className="w-8 h-8 text-white cursor-pointer" />
        </div>
      </div>

      {/* Show Create Device Popup */}
      {showCreatePopup && (
        <CreateDevicePopUp setShowCreatePopup={setShowCreatePopup} />
      )}

      {/* Mobile Menu */}
      <div className="lg:hidden">
        {menuOpen && <MobileMenu isOpen={menuOpen} onClose={toggleMenu} />}
      </div>
    </div>
  );
};

export default Header;
