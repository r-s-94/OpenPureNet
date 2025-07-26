import { useNavigate } from "react-router-dom";
import DataprotectionComponent from "./dataProtectionComponent";
import { useContext } from "react";
import { userAuthContext } from "@/userAuthContext";

export default function DataProtection() {
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
    <div>
      <div>
        <button
          onClick={checkUserSession}
          className="mt-10 ml-20 cursor-pointer"
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
      <div>
        <h1 className="text-3xl text-center">Datenschutz OpenPureNet</h1>
        <DataprotectionComponent />
      </div>
    </div>
  );
}
