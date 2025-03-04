import React from "react";
import CreateDevice from "./CreateDevice";

const Dashboard = () => {
  return (
    <div
      className="h-[100vh] w-full"
      style={{ background: "linear-gradient(to right, #000000, #0033FF)" }}
    >
      <CreateDevice />
    </div>
  );
};

export default Dashboard;
