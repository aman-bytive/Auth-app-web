import { useNavigate } from "react-router-dom";
import viteLogo from "/vite.svg";

const WelcomeSign = ({ heading, subHeading, desc, subDesc, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "Sign Up") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="pl-0 xl:pl-[10%] lg:pr-[8%] h-full w-full">
      <div className="flex flex-col lg:w-[626px] px-10 gap-7 border-none my-[40px] justify-center items-center bg-primary h-[90%] md:px-[50px]">
        <h1 className="text-center lg:text-left md:w-[497px] font-semibold text-[30px] md:text-[40px] leading-tight text-white">
          {heading}
          <span className="text-[30px] md:text-[48px]">
            <br /> {subHeading}
          </span>
        </h1>

        <p className="hidden md:block text-center lg:text-left text-[18px] text-white  md:w-[497px]">
          {desc}
        </p>

        {subDesc && (
          <p className="text-center lg:text-left text-[18px] text-white  md:w-[497px]">
            {subDesc}
          </p>
        )}
        <div className="hidden md:block text-center lg:text-left md:w-[497px]">
          <button
            className="cursor-pointer border-[1px] uppercase w-max pl-14 pr-14 border-[#A1B0F8] rounded-[10px] text-primary text-[20px] font-bold h-[53px] bg-[white] "
            style={{ boxShadow: "0px 5px 15px 4px rgba(77, 92, 121, 1) " }}
            onClick={handleClick}
          >
            {type}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSign;
