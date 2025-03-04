import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";

//  Validation Schema for Device Creation
const validationSchema = Yup.object({
  deviceId: Yup.string()
    .matches(
      /^[A-Za-z]{4}-\d{4}-[A-Za-z]{4}-\d{4}$/,
      "Device ID must be in the format: aaaa-1111-bbbb-2222"
    )
    .required("Device ID is required"),
  deviceName: Yup.string().required("Device Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
});

const CreateDevicePopUp = ({ setShowCreatePopup, addDevice }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;

  // Formik setup
  const formik = useFormik({
    initialValues: {
      deviceId: "",
      deviceName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/api/devices`,
          {
            deviceId: values.deviceId,
            deviceName: values.deviceName,
            password: values.password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );

        // Save password to .password file
        const devicePassword = response.data.password;
        const passwordFile = new File([devicePassword], ".password", {
          type: "text/plain",
        });

        // Get the device ID and modify it for the upload API
        const deviceId = response.data.id;
        const uploadId = deviceId - 1;

        // Create a FormData object to send the password as part of the request
        const formData = new FormData();
        formData.append("files", passwordFile);

        await axios.post(
          `${baseUrl}/api/devices/${uploadId}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        // Add the new device to the device list instantly
        addDevice(response.data);
        setLoading(false);
        setShowCreatePopup(false);
      } catch (error) {
        console.error("Error creating device:", error);
        setLoading(false);
        toast(error?.response?.data?.error?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          type: "error",
        });
      }
    },
  });

  // Handle cancel button
  const handleCancel = () => {
    formik.resetForm();
    setShowCreatePopup(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000cf] bg-opacity-50 z-50 px-3 md:px-0">
      <div className="bg-white text-black p-6 rounded-md w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Create Device</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4 sm:mb-4">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="deviceId"
            >
              Device ID<span className="text-red-500"> *</span>
            </label>
            <input
              className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
              type="text"
              name="deviceId"
              placeholder="aaaa-1111-bbbb-2222"
              value={formik.values.deviceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
            />
            {formik.touched.deviceId && formik.errors.deviceId && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.deviceId}
              </div>
            )}
          </div>

          <div className="w-full mb-4 sm:mb-4">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="deviceName"
            >
              Device Name<span className="text-red-500"> *</span>
            </label>
            <input
              className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
              type="text"
              name="deviceName"
              placeholder="Device Name"
              value={formik.values.deviceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
            />
            {formik.touched.deviceName && formik.errors.deviceName && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.deviceName}
              </div>
            )}
          </div>

          <div className="w-full mb-4 sm:mb-12 ">
            <label
              className="block text-black font-semibold mb-2"
              htmlFor="password"
            >
              Password<span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              <input
                className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-md cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDevicePopUp;
