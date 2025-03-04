import React from "react";

const ConfirmationPopUp = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000000cf] bg-opacity-50 z-50 px-3 md:px-0">
      <div className="bg-white rounded-md p-6 w-[400px] text-center">
        <h3 className="font-semibold text-lg mb-4">
          {message || "Are you sure you want to delete this document?"}
        </h3>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;
