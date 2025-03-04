import React from "react";
import WelcomeSign from "../../../components/WelcomeSign";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  return (
    <div
      className="h-[100vh] lg:h-[100vh] w-full overflow-y-scroll"
      style={{ background: "linear-gradient(to right, #000000, #0033FF)" }}
    >
      <div className="h-[100vh] flex flex-col lg:flex-row items-center gap-10">
        <div className="lg:h-full w-full lg:w-[50%]">
          <WelcomeSign
            heading="Welcome to"
            subHeading="Device Management System"
            desc="This system organizes, secures, and controls file and device access. It offers file management, device monitoring, user access control, encryption, and compliance. With remote control, backups, and OS compatibility, it streamlines workflows and enhances digital asset management."
            subDesc="To join us, please sign up below to create your account"
            type="Login"
          />
        </div>
        <div className="lg:h-full w-full lg:w-[50%] md:flex justify-center lg:pt-8 pb-4">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
