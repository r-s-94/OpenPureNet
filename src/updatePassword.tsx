import { useState } from "react";
import { supabase } from "./supabase";
import { Link } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function UpadatePassword() {
  const [updatePassword, setUpdatePassword] = useState<string>("");

  async function editPasswort() {
    if (updatePassword !== "") {
      await supabase.auth.updateUser({ password: updatePassword });

      toast.success("Dein Passwort wurde erfolgreich geändert.", {
        unstyled: true,
        className: "w-[25rem] h-[7rem] px-5",
      });
      setUpdatePassword("");
    } else {
      toast.info("Bitte gebe ein neues Passwort ein.", {
        unstyled: true,
        className: "w-[25rem] h-[5rem]",
      });
      setUpdatePassword("");
    }
  }

  return (
    <section>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Link to="/">
        <svg
          xmlns="http://www.w5.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-13 mt-10 ml-20 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>

      <div className="w-[35rem] mx-auto mt-20 px-5 py-15 flex justify-center items-center gap-x-3 bg-gray-50 border border-gray-400 rounded-sm">
        <input
          type="text"
          value={updatePassword}
          onChange={(event) => {
            setUpdatePassword(event.target.value);
          }}
          className="pl-2 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
          placeholder="neues Passwort eingeben"
          name=""
          id=""
        />
        <button
          onClick={editPasswort}
          className="px-10 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer"
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
