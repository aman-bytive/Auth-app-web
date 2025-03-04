import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "../../components/Header";
import CreateDevicePopUp from "../../components/CreateDevicePopUp";
import UploadDocument from "../../components/UploadDocument";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";

const DeviceFolderList = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Error message for incorrect password
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [isDocumentView, setIsDocumentView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pageSize] = useState(12);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;
  const token = localStorage.getItem("jwt");

  const handleDeviceListClick = () => {
    navigate("/dashboard");
  };

  // Fetch device data
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("🚀 ~ useEffect ~ response:", response.data);
        return setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        toast(error?.response?.data?.error?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          type: "error",
        });
      });
  }, [token]);

  // Pagination:
  const paginatedDevices = devices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pageCount = Math.ceil(devices.length / pageSize);

  // Handle next and previous page navigation
  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Function to handle adding device
  const addDevice = (device) => {
    setDevices((prevDevices) => [device, ...prevDevices]);
  };

  const handleFolderClick = (device) => {
    setSelectedDevice(device);
    setIsDocumentView(false);
    setShowPasswordPopup(true);
    setPasswordError("");
    setPasswordInput("");
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const handlePasswordSubmit = () => {
    if (!passwordInput.trim()) {
      setPasswordError("Password is required.");
      return;
    }
    axios
      .get(
        `${baseUrl}/api/devices/${selectedDevice?.id}/files?password=${passwordInput}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setFileData(response?.data?.files);
        setShowPasswordPopup(false); // Close the popup
        setIsDocumentView(true);
        setPasswordInput("");
        setPasswordError(""); // Clear error on successful submission
      })
      .catch((error) => {
        console.error("Error password failed:", error);
        setPasswordError("Incorrect password. Please try again.");
        toast(error?.response?.data?.error?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          type: "error",
        });
      });
  };

  const handleBack = () => {
    setSelectedDevice(null);
    setFileData([]);
    setIsDocumentView(false);
  };

  return (
    <div
      className="h-[100vh] w-full"
      style={{ background: "linear-gradient(to right, #000000, #0033FF)" }}
    >
      {/* Header Section */}
      <Header />

      <div className="py-3 px-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <button
            onClick={handleDeviceListClick}
            className="bg-[#004E72] text-white px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
          >
            Device List
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="flex flex-row items-center gap-2 pt-4">
            <h1 className="font-semibold text-white text-[20px] pr-10">
              {!isDocumentView ? "All Folders " : "All Documents"}
            </h1>
          </div>
        </div>

        <div className="rounded-lg my-4 p-5 overflow-auto shadow-md bg-white overflow-y-scroll h-[70vh] md:h-auto">
          {fileData?.length && isDocumentView ? (
            <UploadDocument
              device={selectedDevice}
              onClose={() => setSelectedDevice(null)}
              onBack={handleBack}
              fileData={fileData}
              setFileData={setFileData}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedDevices.length > 0 ? (
                  paginatedDevices.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        boxShadow: "0px 5px 18px 0px #B6C6E3",
                      }}
                      className="p-4 cursor-pointer rounded-lg flex flex-col items-center justify-center text-center bg-white shadow-md"
                      onClick={() => handleFolderClick(item)}
                    >
                      <FaFolder className="text-blue-500 text-4xl mb-2" />
                      <div className="font-semibold">
                        {item?.deviceName || "Device Name"}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {new Date(item?.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center">
                    No folder available
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {devices.length > pageSize && (
                <div className="w-full flex justify-center pt-[40px] md:pt-[40px]">
                  <div className="flex gap-2 w-full justify-around">
                    {/* Previous Button */}
                    <div>
                      <button
                        className={`flex items-center justify-center text-[#0033FF] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300  ${
                          currentPage === 1
                            ? "text-[#0033FF] cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        <FaArrowLeft className="mr-2" />
                        Previous
                      </button>
                    </div>

                    {/* Page Numbers */}
                    <div className="flex gap-3">
                      {[...Array(pageCount)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageClick(i + 1)}
                          className={`px-3 py-2 text-[14px] md:text-[16px] font-[600] rounded-[8px] cursor-pointer  ${
                            currentPage === i + 1
                              ? "bg-[#ffffff] text-[#0033FF] shadow-[0_2px_10px_rgba(0,0,0,0.3)] "
                              : "bg-white text-[#546ed8]"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <div>
                      <button
                        className={`flex items-center justify-center text-[#0033FF] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300 ${
                          currentPage === pageCount
                            ? "text-[#0033FF] cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handleNextPage}
                        disabled={currentPage === pageCount}
                      >
                        Next
                        <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Password Popup */}
        {showPasswordPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000cf] bg-opacity-50 z-50 px-3 md:px-0">
            <div className="bg-white p-6 rounded-md w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Enter Device Password</h2>
                <button
                  className="text-xl cursor-pointer"
                  onClick={() => setShowPasswordPopup(false)}
                >
                  <IoMdClose />
                </button>
              </div>

              <div className="w-full mb-4 sm:mb-12 ">
                <label
                  className="block text-black font-semibold mb-2"
                  htmlFor="fullName"
                >
                  Password<span className="text-red-500"> *</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      boxShadow: "0px 5px 18px 0px #B6C6E3",
                    }}
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}{" "}
                  </span>
                </div>
                {passwordError && (
                  <div className="text-red-500 text-sm mb-4">
                    {passwordError}
                  </div>
                )}
              </div>

              <button
                onClick={handlePasswordSubmit}
                className="bg-[#004E72] text-white py-2 px-4 rounded-md w-full cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Show Create Device PopUp */}
        {showCreatePopup && (
          <CreateDevicePopUp
            setShowCreatePopup={setShowCreatePopup}
            addDevice={addDevice} // Pass to add the new device to the list
          />
        )}
      </div>
    </div>
  );
};

export default DeviceFolderList;
