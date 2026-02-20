import "./updatePassword.css";
import { useState } from "react";
import { supabase } from "./supabase";
import { Link } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import "./responsive.css";

export default function UpadatePassword() {
  const [updatePassword, setUpdatePassword] = useState<string>("");

  async function editPasswort() {
    await supabase.auth.updateUser({ password: updatePassword });

    toast.success(
      "Dein Passwort wurde erfolgreich geändert. Du kannst jetzt dich jetzt wider einloggen.",
      {
        unstyled: true,
        className: "w-[25rem] h-[7rem] px-5",
      },
    );
    setUpdatePassword("");
  }

  return (
    <section className="update-password-section h-screen">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Link to="/" className="update-password-section-back-link">
        <svg
          xmlns="http://www.w5.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="update-password-section-back-icon w-10 pt-10 ml-30 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <div className="update-password-section-main-div w-[35rem] mx-auto mt-20 px-5 py-15 flex flex-col justify-center items-center gap-y-3 bg-white border border-e-gray-300 rounded-sm">
        <input
          type="text"
          value={updatePassword}
          onChange={(event) => {
            setUpdatePassword(event.target.value);
          }}
          className="update-password-input pl-2 py-1.5 text-lg w-[15.3rem] bg-white border border-gray-400 rounded-sm"
          placeholder="neues Passwort eingeben"
          name=""
          id=""
        />
        <button
          onClick={editPasswort}
          disabled={!(updatePassword.length > 5)}
          className={`update-password-button px-10 py-1.5 text-lg flex justify-center items-center transition-all duration-300 ease-in-out ${updatePassword.length > 5 ? "bg-blue-500 text-white border border-white rounded-sm hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} cursor-pointer`}
        >
          Passwort ändern
        </button>
      </div>
    </section>
  );
  /*<Dialog open={noticePopUp} onOpenChange={setNoticePopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="p-5 text-black flex flex-col gap-10">
              <p className="text-[18px]">{noticeMessage}</p>
              <button
                onClick={() => {
                  setNoticeMessage("");
                  setNoticePopUp(false);
                }}
                className="px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
              >
                schließen
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  
  */
}
