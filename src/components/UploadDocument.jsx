import axios from "axios";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileVideo,
  FaFile,
  FaSpinner,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import ConfirmationPopUp from "./ConfirmationPopUp";

const UploadDocument = ({ device, onClose, onBack, fileData, setFileData }) => {
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;
  const token = localStorage.getItem("jwt");

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files?.length) {
      setSelectedFile(files[0]);
      handleUpload(...files);
    }
  };

  const getFileIcon = (file) => {
    const fileType = file.mime; // Get the MIME type
    const fileName = file.name.toLowerCase();

    // Check if it's a PDF, Word, Image, or Video
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return <FaFilePdf className="text-red-700 w-8 h-8" />;
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return <FaFileWord className="text-blue-500 w-8 h-8" />;
    } else if (fileType.startsWith("image/")) {
      return <FaFileImage className="text-green-500 w-8 h-8" />;
    } else if (fileType.startsWith("video/mp4") || fileName.endsWith(".mp4")) {
      return <FaFileVideo className="text-purple-500 w-8 h-8" />;
    } else {
      return <FaFile className="text-gray-500 w-8 h-8" />;
    }
  };

  const handleFileOpen = (file) => {
    const fileURL = `${baseUrl}${file.url}`;
    window.open(fileURL, "_blank");
  };

  // Handle upload of selected files
  const handleUpload = async (newFile) => {
    const formData = new FormData();
    formData.append("files", newFile); // Append each file to form data

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/devices/${device.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (response) {
        console.log("🚀 ~ handleUpload ~ response:", response?.data);
        setFileData([...fileData, response?.data?.files[0]]);
      }
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast(error?.response?.data?.error?.message, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
        type: "error",
      });
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDocsDelete = (fileToRemove) => {
    axios
      .delete(`${baseUrl}/api/files/${fileToRemove?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setFileData((prevFiles) =>
          prevFiles.filter((file) => file !== fileToRemove)
        );
        setShowConfirmation(false);
      })

      .catch((error) => {
        console.error("Error deleting document:", error);
        toast(error?.response?.data?.error?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          type: "error",
        });
      });
  };

  // Show confirmation popup before delete
  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowConfirmation(true);
  };

  // Hide confirmation popup
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setFileToDelete(null);
  };

  return (
    <div className="md:px-6 rounded-md w-full">
      <div>
        <IoArrowBack onClick={onBack} className="text-black cursor-pointer" />
      </div>
      <h2 className="text-xl font-semibold text-center mb-4">
        {device.deviceName}
      </h2>
      {/* File input */}
      <div className="w-full md:w-[20%] mx-auto">
        <label
          htmlFor="file-upload"
          className="w-full p-2 border border-gray-300 rounded-md my-4 cursor-pointer flex justify-center items-center"
        >
          {loading ? (
            <FiLoader className="animate-spin text-blue-500 w-8 h-8" />
          ) : (
            <span>{selectedFile ? `Upload File ` : "Upload File"}</span>
          )}
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      {/* Display uploaded files */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fileData?.length > 0 ? (
          fileData?.map((file, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-md mb-2 flex flex-col justify-center items-center cursor-pointer"
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
              onClick={() => handleFileOpen(file)}
            >
              <div className="w-full flex justify-end mb-4">
                {file.name !== ".password" && (
                  <button
                    className="text-xl cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(file);
                    }}
                  >
                    <IoMdClose className="text-red-700 w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 items-center">
                {getFileIcon(file)}
                <div className="text-sm text-center">
                  <div
                    className="font-semibold text-center"
                    style={{ wordBreak: "break-word" }}
                  >
                    {file.name.slice(0, 20)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(file?.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No documents uploaded yet
          </p>
        )}
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <ConfirmationPopUp
          message="Are you sure you want to delete this document?"
          onCancel={handleCancelDelete}
          onConfirm={() => handleDocsDelete(fileToDelete)}
        />
      )}
    </div>
  );
};

export default UploadDocument;
