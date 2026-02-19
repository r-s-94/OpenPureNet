import { Link } from "react-router-dom";
import DataprotectionComponent from "./dataProtectionComponent";

//import "../responsive.css";

export default function DataProtection() {
  return (
    <div className="data-protection-section">
      <Link to="/" className="data-protection-section-back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="data-protection-section-back-icon w-10 mt-10 ml-30 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <div className="data-protection-section-main-div">
        <h1 className="data-protection-section-headline text-3xl text-center">
          Datenschutz OpenPureNet
        </h1>
        <DataprotectionComponent />
      </div>
    </div>
  );
}
