import { useNavigate } from "react-router-dom";
import AGBComponent from "./agbComponent";
import { useContext } from "react";
import { userAuthContext } from "@/userAuthContext";
//import "../responsive.css";

export default function AGB() {
  const { userAuthObject } = useContext(userAuthContext);
  const navigation = useNavigate();

  function checkUserSession() {
    if (userAuthObject.accessToken) {
      navigation("/private-route/overview");
    } else {
      navigation("/");
    }
  }

  return (
    <div className="agb-section">
      <div className="agb-button-div">
        <button
          onClick={checkUserSession}
          className="agb-button mt-15 ml-30 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>
      <div className="agb-div">
        <h1 className="agb-headline text-3xl text-center">AGB OpenPureNet</h1>
        <AGBComponent />
      </div>
    </div>
  );
}
