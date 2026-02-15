import { userAuthContext } from "@/userAuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
//import "../responsive.css";

export default function Impressum() {
  const { userAuthObject } = useContext(userAuthContext);
  const navigation = useNavigate();

  function checkUserSession() {
    if (userAuthObject !== null) {
      navigation("/private-route/overview");
    } else {
      navigation("/");
    }
  }

  return (
    <div className="impressum-section">
      {" "}
      <button
        onClick={checkUserSession}
        className="impressum-back-button mt-10 ml-30 cursor-pointer"
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
      <div className="impressum-div flex flex-col items-center justify-center">
        <h2 className="impressum-headline text-3xl">Impressum</h2>

        <div className="tmg-div mt-3">
          <p className="tmg-headline text-lg">Angaben gemäß § 5 TMG</p>
          <p className="tmg-name text-lg">Sven Richter</p>
          <p className="tmg-adress text-lg">
            Wartislawstraße 10 <br />
            18437 Stralsund
          </p>
          <br />
          <p className="tmg-contact mt-5 text-xl text-center">Kontakt</p>
          <p className="tmg-mail text-lg">open-pure-net@web.de</p>
        </div>
      </div>
    </div>
  );
}
