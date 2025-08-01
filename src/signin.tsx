import { useContext, useState } from "react";
import "./signin.css";
import { supabase } from "./supabase";
import { Link, useNavigate } from "react-router-dom";
import OpenPureNetImg from "./assets/file_00000000ee0c62439f43a8742db56e32_conversation_id=67f35b16-4744-8007-a628-17eeb6144e1f&message_id=69f1568f-bddb-48da-ad56-48b9123c8e49.png";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { userAuthContext } from "./userAuthContext";
import { functionContext } from "./functionContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function SignIn() {
  const [userMail, setUserMail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [resetUserPasswort, setResetUserPasswort] = useState<string>("");
  const [, setNoticePopUp] = useState<boolean>(false);
  const [, setNoticePopUpMessage] = useState<string>("");
  const navigation = useNavigate();
  const { checkUserSession } = useContext(functionContext);
  const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);

  async function signIn() {
    if (userMail !== "" && userPassword !== "") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userMail,
        password: userPassword,
      });

      if (
        error?.code === "invalid_credentials" ||
        error?.code === "email_address_invalid" ||
        error?.status === 400
      ) {
        toast.error(
          "Der Benutzername/E-Mail oder das Passwort war nicht richtig.",
          {
            unstyled: true,
            className: "w-[25rem] h-[7rem] px-5",
          }
        );
        setUserPassword("");
      } else {
        setUserAuthObject({
          ...userAuthObject,
          accessToken: data.session!.access_token,
          isAuthenticated: true,
        });
        checkUserSession();
        navigation("/private-route/overview");
        setUserMail("");
        setUserPassword("");
      }
    } else {
      toast.info("Beide Felder müssen ausgefühlt sein.", {
        unstyled: true,
        className: "w-[27rem] h-[5rem]",
      });
    }
  }

  async function resetPassword() {
    const {} = await supabase.auth.resetPasswordForEmail(resetUserPasswort, {
      redirectTo: "http://localhost:5173/OpenPureNet/update-password",
    });

    toast.info(
      "Wir haben dir eine E-Mail zum Zurücksetzten deines Passwortes gesendet.",
      {
        unstyled: true,
        className: "w-[25rem] h-[10rem] px-5",
      }
    );
    setResetUserPasswort("");
  }

  return (
    <div className="signin-section w-full h-screen flex flex-col items-center justify-center gap-y-5 bg-cover bg-no-repeat bg-center">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <div className="mx-auto my-3 flex justify-center items-center gap-x-3">
        <img src={OpenPureNetImg} className="w-35 rounded-full" alt="" />
        <div className="px-20 py-10 bg-white opacity-80 rounded-sm">
          <h1 className="text-5xl text-black">OpenPureNet</h1>
        </div>
      </div>

      <div className="signin-div px-20 pb-5 flex flex-col items-center justify-center bg-white rounded-sm">
        <div className="mt-15 flex flex-col items-center justify-center gap-y-3">
          {" "}
          <input
            type="text"
            value={userMail}
            onChange={(event) => {
              setUserMail(event.target.value);
            }}
            placeholder="Benutzername\E-Mail"
            className="pl-2 py-1.5 text-lg border border-gray-400 rounded-sm"
            name=""
          />
          <input
            type="password"
            value={userPassword}
            onChange={(event) => {
              setUserPassword(event.target.value);
            }}
            placeholder="Passwort"
            className="pl-2 py-1.5 text-lg border border-gray-400 rounded-sm"
            name=""
          />
          <button
            onClick={signIn}
            className="mt-5 px-16.5 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
          >
            Anmelden
          </button>
        </div>

        <div className="w-[14rem] flex flex-col item justify-center gap-y-3">
          <p className="mt-5 text-lg">Passwort vergessen?</p>
          <input
            type="text"
            value={resetUserPasswort}
            onChange={(event) => {
              setResetUserPasswort(event.target.value);
            }}
            placeholder="E-Mail eingeben"
            className="pl-2 py-1.5 text-lg border border-gray-400 rounded-sm"
            name=""
          />{" "}
          <button
            onClick={resetPassword}
            className="px-10 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer"
          >
            E-Mail senden
          </button>
        </div>

        <div className="w-[15rem] pt-5 text-lg">
          <span className="mr-3 text-red-500">Hinweis!</span>Die
          Social-Media-Plattform OpenPureNet befindet sich noch in einer
          Testphase. Solange wie die Testphase läuft, ist die Nutzung kostenlos.
          Registrierungen laufen über die E-Mail-Adresse open-pure-net@web.de.
        </div>
      </div>

      <div className="w-full py-3 flex justify-center items-center gap-x-3 bg-white border border-gray-200">
        <Link to="/impressum" className="cursor-pointer">
          Impressum
        </Link>
        <span>|</span>
        <Link to="/agb" className="cursor-pointer">
          AGB
        </Link>
        <span>|</span>
        <Link to="/data-protection" className="cursor-pointer">
          Datenschutz
        </Link>
        <span>|</span>
        <a href="mailto:open-pure-net@web.de">Kontakt/Support</a>
        <Tooltip>
          <TooltipTrigger className="flex justify-center items-center">
            <button
              onClick={() => {
                setNoticePopUpMessage(
                  `Du möchtest etwas melden. Du möchtest uns Kritik oder Anregungen
               mitteilen? Dann schreib unserem Supportteam per Mail an open-pure-net@web.de.`
                );
                setNoticePopUp(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-[15rem] p-5 text-base bg-white text-black border border-gray-400">
            {" "}
            Du möchtest etwas melden oder hast Angregungen für uns? Schreib
            unserem Support-Team einfach eine Mail an open-pure-net@web.de.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
  /*
  
  */
}
