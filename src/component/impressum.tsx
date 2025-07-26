import { supabase } from "@/supabase";
import { userAuthContext } from "@/userAuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Impressum() {
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
      {" "}
      <button onClick={checkUserSession} className="mt-10 ml-20 cursor-pointer">
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
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl">Impressum</h2>

        <div className="mt-3">
          <p className="text-lg">Angaben gemäß § 5 TMG</p>
          <p className="text-lg">Sven Richter</p>
          <p className="text-lg">
            Wartislawstraße 10 <br />
            18437 Stralsund
          </p>
          <br />
          <p className="mt-5 text-xl text-center">Kontakt</p>
          <p className="text-lg">open-pure-net@web.de</p>
        </div>
      </div>
    </div>
  );
}
