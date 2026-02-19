import "./forgotPassword.css";
import { useState } from "react";
import { supabase } from "./supabase";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import "./responsive.css";

export default function ForgotPassword() {
  const [userMail, setUserMail] = useState<string>("");

  async function resetPassword() {
    const {} = await supabase.auth.resetPasswordForEmail(userMail, {
      redirectTo: "http://localhost:5173/OpenPureNet/update-password",
    });

    toast.success(
      "Wir haben dir eine E-Mail zum Zurücksetzten deines Passwortes gesendet.",
      {
        unstyled: true,
        className: "w-[25rem] h-[10rem] px-5",
      },
    );

    setUserMail("");
  }

  return (
    <section className="forget-password-section h-screen">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Link to="/" className="forget-password-section-back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="forget-password-section-back-icon w-10 pt-10 ml-30 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <p className="forget-password-section-text mt-10 mx-10 text-center text-2xl">
        Passwort vergessen? Gib deine E-Mail-Adresse ein, um dein Passwort
        zurückzusetzen.
      </p>

      <div className="forget-password-section-main-div w-[35rem] mx-auto mt-10 px-5 py-15 flex flex-col justify-center items-center gap-y-3 bg-white border border-gray-300 rounded-sm">
        <input
          type="text"
          value={userMail}
          onChange={(event) => {
            setUserMail(event.target.value.trimStart());
          }}
          placeholder="E-Mail eingeben"
          className="forget-password-section-password-input w-[15.3rem] pl-2 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
          name=""
        />{" "}
        <button
          onClick={resetPassword}
          disabled={!(userMail.length > 0)}
          className={`forget-password-section-password-reset-button px-7 py-1.5 flex justify-center items-center text-lg transition-all duration-300 ease-in-out ${userMail.length > 0 ? "bg-blue-500 text-white border border-white  hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"}  cursor-pointer rounded-sm`}
        >
          Passwort-Link anfodern
        </button>
      </div>
    </section>
  );
}
