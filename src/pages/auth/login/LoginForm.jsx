import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { toast } from "react-toastify";
import viteLogo from "/vite.svg";

// Validation Schema
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_STRAPI_API_BASE_URL;

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        // Send the login request to the API
        const response = await axios.post(`${baseUrl}/api/auth/local`, {
          identifier: values.email,
          password: values.password,
        });

        console.log("User logged in successfully:", response.data);
        const userId = response.data.user.id;
        // Successful login, store the JWT token in localStorage
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", response.data.user.username);
        localStorage.setItem("emailId", response.data.user.email);
        localStorage.setItem("company", response.data.user.company);

        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Error during login:",
          error?.response?.data?.error?.message || error
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
        <div className="hidden lg:block lg:mb-[58px]">
          <img
            src={viteLogo}
            alt="Logo"
            style={{ height: "148px", width: "458px" }}
          />
        </div>

        <h1 className="text-[24px] font-semibold pb-6 text-white">Log In</h1>

        <form className="w-full" onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4 sm:mb-6">
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

          <div className="w-full mb-4 sm:mb-12 ">
            <label
              className="block text-white font-semibold mb-2"
              htmlFor="fullName"
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
              {formik.isSubmitting ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>
        <div className="md:hidden text-white flex justify-between items-center px-1">
          <p className="text-[16px]">Create an account ?</p>
          <p
            className="cursor-pointer text-right text-[16px] font-bold"
            onClick={handleSignupClick}
          >
            SignUp
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
