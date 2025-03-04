import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import SignUp from "../pages/auth/signUp/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";
import DeviceFolderList from "../pages/dashboard/DeviceFolderList";

const NavigationRoutes = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("jwt");

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      navigate("/login");
    }
    // If the user is already authenticated
    if (
      isAuthenticated &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/signup")
    ) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-[100%] h-full relative ">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Dashboard /> : <SignUp />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route
          path="/deviceFolderList"
          element={isAuthenticated ? <DeviceFolderList /> : <Login />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <NavigationRoutes />
    </BrowserRouter>
  );
};

export default App;
