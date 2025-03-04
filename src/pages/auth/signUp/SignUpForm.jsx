import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { toast } from "react-toastify";
import viteLogo from "/vite.svg";

// Validation Schema
export const signUpValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
  companyName: Yup.string().required("Company name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;

  const handleLoginClick = () => {
    navigate("/login");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      companyName: "",
      userName: "",
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values) => {
      try {
        // 1. Send the sign-up request to register the user
        const registerResponse = await axios.post(
          `${baseUrl}/api/auth/local/register`,
          {
            username: values.userName,
            email: values.email,
            password: values.password,
          }
        );

        // Extract the user ID from the response
        const userId = registerResponse.data.user.id;
        const token = registerResponse.data.jwt;

        console.log("User registered successfully:", registerResponse.data);

        // 2. Update user with company name
        const updateResponse = await axios.put(
          `${baseUrl}/api/users/${userId}`,
          { company: values.companyName },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Company name updated:", updateResponse.data);

        // 3. Store data in local storage
        localStorage.setItem("jwt", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", registerResponse.data.user.username);
        localStorage.setItem("emailId", registerResponse.data.user.email);
        localStorage.setItem("company", values.companyName);

        console.log(
          "User company name updated successfully:",
          updateResponse.data
        );
        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Error during sign-up or updating user:",
          error.response?.data || error
        );
        toast(error?.response?.data?.error?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          type: "error",
        });
      }
    },
  });

  return (
    <div className="w-full md:w-[70%] flex flex-col md:justify-center px-8 md:px-0">
      <div className="w-full lg:max-w-[460px] mx-auto">
        <div className="hidden lg:block ">
          <img
            src={viteLogo}
            alt="Logo"
            style={{ height: "148px", width: "458px" }}
          />
        </div>

        <h1 className="text-[24px] font-semibold pb-6 text-white">Sign Up</h1>

        <form className="w-full" onSubmit={formik.handleSubmit}>
          {/* Company Name Field */}
          <div className="w-full mb-4 sm:mb-4">
            <label
              className="block text-white font-semibold mb-2"
              htmlFor="companyName"
            >
              Company Name<span className="text-red-500"> *</span>
            </label>
            <input
              className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
            />
            {formik.touched.companyName && formik.errors.companyName && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.companyName}
              </div>
            )}
          </div>

          {/* UserName Field */}
          <div className="w-full mb-4 sm:mb-4">
            <label
              className="block text-white font-semibold mb-2"
              htmlFor="userName"
            >
              Username<span className="text-red-500"> *</span>
            </label>
            <input
              className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
              type="text"
              name="userName"
              placeholder="Username"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
            />
            {formik.touched.userName && formik.errors.userName && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.userName}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="w-full mb-4 sm:mb-4">
            <label
              className="block text-white font-semibold mb-2"
              htmlFor="email"
            >
              Email ID<span className="text-red-500"> *</span>
            </label>
            <input
              className="w-full p-3 backdrop-blur-sm bg-white text-black rounded-lg"
              type="email"
              name="email"
              placeholder="Email ID"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              style={{
                boxShadow: "0px 5px 18px 0px #B6C6E3",
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-[10px] px-2">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full mb-4 sm:mb-12">
            <label
              className="block text-white font-semibold mb-2"
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

          <div className="flex justify-center items-center pb-10">
            <button
              className="cursor-pointer w-[100%] h-[45px] md:h-[53px] flex justify-center items-center font-semibold text-[20px] rounded-[10px] bg-primary text-[white]"
              type="submit"
              disabled={formik.isSubmitting}
              style={{
                boxShadow: "1px 2px 19px 0px rgba(253, 253, 253, 1)",
              }}
            >
              {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="md:hidden text-white flex justify-between items-center px-1">
          <p className="text-[16px]">Already have an account ?</p>
          <p
            className="cursor-pointer text-right text-[16px] font-bold"
            onClick={handleLoginClick}
          >
            Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
