import { useState } from "react";
import { supabase } from "./supabase";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [userMail, setUserMail] = useState<string>("");
  async function resetPassword() {
    if (userMail !== "") {
      const {} = await supabase.auth.resetPasswordForEmail(userMail, {
        redirectTo: "http://localhost:5173/OpenPureNet/update-password",
      });

      toast.success(
        "Wir haben dir eine E-Mail zum Zurücksetzten deines Passwortes gesendet.",
        {
          unstyled: true,
          className: "w-[25rem] h-[10rem] px-5",
        }
      );
    } else {
      toast.error(
        "Bitte gebe deine E-Mail in das Feld ein um dein Passwort zurück zusetzten.",
        {
          unstyled: true,
          className: "w-[27rem] h-[10rem] px-7",
        }
      );
    }

    setUserMail("");
  }

  return (
    <section className="">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Link to="/" className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-13 mt-10 ml-20 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <p className="mt-10 text-center text-2xl">
        Passwort vergessen? Gib deine E-Mail-Adresse ein, um dein Passwort
        zurückzusetzen.
      </p>

      <div className="w-[35rem] mx-auto mt-10 px-5 py-15 flex justify-center items-center gap-x-3 bg-gray-50 border border-gray-400 rounded-sm">
        <input
          type="text"
          value={userMail}
          onChange={(event) => {
            setUserMail(event.target.value);
          }}
          placeholder="E-Mail eingeben"
          className="pl-2 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
          name=""
        />{" "}
        <button
          onClick={resetPassword}
          className="px-10 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer"
        >
          E-Mail senden
        </button>
      </div>
    </section>
  );
}
