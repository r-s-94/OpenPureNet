import { Link } from "react-router-dom";
import AGBComponent from "./agbComponent";

//import "../responsive.css";

export default function AGB() {
  return (
    <div className="agb-section">
      <Link to="/" className="agb-section-back-link ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="agb-section-back-icon w-10 mt-10 ml-30 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <div className="agb-section-main-div">
        <h1 className="agb-section-headline text-3xl text-center">
          AGB OpenPureNet
        </h1>
        <AGBComponent />
      </div>
    </div>
  );
}
