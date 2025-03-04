import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
import DeviceFolderList from "./DeviceFolderList";

import Header from "../../components/Header";
import CreateDevicePopUp from "../../components/CreateDevicePopUp";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";

const CreateDevice = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showPassword, setShowPassword] = useState({});
  const [showFolderView, setShowFolderView] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;

  // Fetch the JWT token from localStorage
  const token = localStorage.getItem("jwt");

  const handleDeviceFolderClick = () => {
    navigate("/deviceFolderList");
  };

  //   const handleDeviceFolderClick = () => {
  //     setShowFolderView(true);
  //   };

  // Fetch device data
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setDevices(response.data))
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

  const handleDeleteDevice = (device) => {
    setDeviceToDelete(device); // Set the device to delete
    setShowConfirmation(true);
  };

  const confirmDeleteDevice = () => {
    if (deviceToDelete) {
      axios
        .delete(`${baseUrl}/api/devices/${deviceToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setDevices(
            devices.filter((device) => device.id !== deviceToDelete.id)
          );
          setShowConfirmation(false);
          setDeviceToDelete(null); // Reset device to delete
        })
        .catch((error) => {
          console.error("Error deleting device:", error);
          toast(error?.response?.data?.error?.message, {
            position: "top-center",
            autoClose: 5000,
            theme: "dark",
            type: "error",
          });
          setShowConfirmation(false);
        });
    }
  };

  const addDevice = (device) => {
    setDevices((prevDevices) => [...prevDevices, device]);
  };

  // Toggle password visibility for a specific device
  const togglePasswordVisibility = (deviceId) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [deviceId]: !prevState[deviceId],
    }));
  };

  const cancelDeleteDevice = () => {
    setShowConfirmation(false);
    setDeviceToDelete(null); // Reset the device to delete
  };

  // Pagination:
  const paginatedDevices = devices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pageCount = Math.ceil(devices.length / pageSize);

  // Handle next and previous page
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

  return (
    <div style={{ background: "linear-gradient(to right, #000000, #0033FF)" }}>
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <button
            onClick={() => setShowCreatePopup(true)}
            className="bg-[#004E72] text-white px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
          >
            + Create Device
          </button>
          {devices.length > 0 && (
            <button
              onClick={handleDeviceFolderClick}
              className="bg-gray-200 px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
            >
              Device Folder
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="flex flex-row items-center gap-2 pt-4">
            <h1 className="font-semibold text-white text-[20px] pr-10">
              {!showFolderView ? "All Devices" : "All Documents"}
            </h1>
          </div>

          <div className="rounded-lg my-4 py-3 overflow-auto shadow-md bg-white">
            {!showFolderView ? (
              <>
                <table className="w-full text-center border-collapse min-w-[600px] sm:min-w-[1000px]">
                  <thead className="h-12 font-semibold bg-[#F6F6F6] text-[16px]">
                    <tr>
                      <th className="py-2 px-3">Device ID</th>
                      <th className="py-2 px-3">Name</th>
                      {/* <th className="py-2 px-3">Password</th> */}
                      <th className="py-2 px-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDevices.length > 0 ? (
                      paginatedDevices.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b font-medium text-[16px]"
                        >
                          <td className="py-4 px-2">{item.deviceId || "--"}</td>
                          <td className="py-4 px-2">
                            {item.deviceName || "Device Name"}
                          </td>
                          {/* <td className="py-4 px-2 relative">
                            <input
                              type={showPassword[item.id] ? "text" : "password"}
                              value={item.password || "******"}
                              readOnly
                              className="w-fit p-2 bg-transparent border-none text-black placeholder-gray-500"
                            />
                            <span
                              className="absolute top-1/2 right-[30%] transform -translate-y-1/2 cursor-pointer"
                              //   onClick={() => setShowPassword(!showPassword)}
                              onClick={() => togglePasswordVisibility(item.id)}
                            >
                              {showPassword[item.id] ? <IoEyeOff /> : <IoEye />}
                            </span>
                          </td> */}
                          <td className="py-4 px-2">
                            <button
                              onClick={() => handleDeleteDevice(item)}
                              className="text-red-500 cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-4 text-gray-500">
                          No device available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            ) : (
              <DeviceFolderList />
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {!showFolderView && devices.length > pageSize && (
          <div className="w-full flex justify-center pt-[40px] md:pt-[40px]">
            <div className="flex gap-2 w-full justify-around">
              {/* Previous Button */}
              <div>
                <button
                  className={`flex items-center justify-center text-[#fff] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300  ${
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
                  className={`flex items-center justify-center text-[#fff] text-[14px] md:text-[16px] font-[600] p-3 md:px-[20px] md:py-[10px] rounded-[8px] transition-shadow duration-300 ${
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
      </div>

      {/* Show Create Device Popup */}
      {showCreatePopup && (
        <CreateDevicePopUp
          setShowCreatePopup={setShowCreatePopup}
          addDevice={addDevice}
        />
      )}

      {/* Confirmation Popup for device deletion */}
      {showConfirmation && (
        <ConfirmationPopUp
          message="Are you sure you want to delete this device?"
          onCancel={cancelDeleteDevice}
          onConfirm={confirmDeleteDevice}
        />
      )}
    </div>
  );
};

export default CreateDevice;
