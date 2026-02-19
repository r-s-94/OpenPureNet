import "./overview.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useContext, useEffect, useState } from "react";
import { publicUserContext } from "./publicUserContext";
import Post from "./component/post";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
} from "./components/ui/dialog";
import AGBComponent from "./component/agbComponent";
import Dataprotection from "./component/dataProtectionComponent";
import { postsContext } from "./postContext";
import { functionContext } from "./functionContext";
import { Toaster } from "./components/ui/sonner";
//import "./responsive.css";
import { userAuthContext } from "./userAuthContext";
import Nav from "./nav";
import { navContext } from "./navContext";

export default function Overview() {
  const [agbConsent, setAGBConsent] = useState<boolean>(false);
  const [dataprotectionConsent, setDataprotectionConsent] =
    useState<boolean>(false);
  const [userDataConsent, setUserDataConsent] = useState<boolean>(false);
  const [hiddenPostOptions] = useState<string>("hiddenPostOptions");
  const [currentSessionUserId, setCurrentSessionUserId] = useState<string>("");
  const [noticePopUp, setNoticePopUp] = useState<boolean>(false);
  const { consentPopUp, setConsentPopUp } = useContext(functionContext);
  const { publicUserObject, setPublicUserObject } =
    useContext(publicUserContext);
  const { postsArray, setPostsArray } = useContext(postsContext);
  const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);
  const navigation = useNavigate();
  const { setCurrentActiveNavArea } = useContext(navContext);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session.session) {
        const { data: public_user } = await supabase
          .from("public_user")
          .select()
          .eq("user_id", session.session.user.id);

        console.log(public_user);

        setCurrentSessionUserId(session.session.user.id);

        if (public_user && public_user[0] !== undefined) {
          const publicUserData = public_user[0];

          if (
            publicUserData.agb_consent === false ||
            publicUserData.data_protection_consent === false ||
            publicUserData.user_consent === false
          ) {
            setConsentPopUp(true);
          }
        } else {
          setConsentPopUp(true);
        }
      }

      loadPosts();
    };
    setCurrentActiveNavArea("overview");

    fetchAllData();
  }, []);

  async function acceptConsent() {
    const { data: session } = await supabase.auth.getSession();
    const { data } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", session.session!.user.id);

    if (data?.length !== 0) {
      const {} = await supabase
        .from("public_user")
        .update({
          agb_consent: agbConsent,
          data_protection_consent: dataprotectionConsent,
          user_consent: userDataConsent,
        })
        .eq("user_id", data![0].user_id);
      setConsentPopUp(false);
    } else {
      setPublicUserObject({
        ...publicUserObject,
        user_id: currentSessionUserId,
      });

      const {} = await supabase.from("public_user").insert({
        user_id: currentSessionUserId,
        profil_name: "",
        profil_picture: "",
        agb_consent: agbConsent,
        data_protection_consent: dataprotectionConsent,
        user_consent: userDataConsent,
        status_text: "",
      });
      setConsentPopUp(false);
    }
  }

  async function loadPosts() {
    const { data: posts } = await supabase
      .from("posts")
      .select(
        "id, user_id, text, time_stamp, medium, public_user: user_id (id, user_id, profil_name, profil_picture)",
      );
    //.eq("userId", publicUserObject.userId)

    console.log(posts);

    if (posts) {
      const sortedPosts = posts.sort((a, b) => b.id - a.id);
      setPostsArray(sortedPosts);
    }
  }

  async function toSignOut() {
    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      profil_name: "",
      profil_picture: "",
      user_id: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      access_token: "",
      expires_at: 0,
      expires_in: 0,
      refresh_token: "",
      token_type: "",
      user: {
        app_metadata: {
          provider: "",
          providers: [""],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: "",
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: {
          email_verified: false,
        },
      },
    });
    setPostsArray([]);
    navigation("/");
  }

  return (
    <div className="overview-section h-screen flex flex-col items-center justify-center">
      <Dialog open={consentPopUp} onOpenChange={setConsentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="overview-section-consent-popup !max-w-7xl"
        >
          <DialogDescription className="overview-section-consent-popup-description h-[90vh] px-3 py-5 text-black flex flex-col items-center gap-y-10 overflow-y-scroll">
            <div className="overview-section-consent-popup-agb-div w-[95%] flex flex-col items-start justify-center gap-y-3">
              <h2 className="overview-section-consent-popup-headline text-lg">
                Allgemine Geschäftsbedingungen (AGB) von OpenPureNet
              </h2>
              <div className="overview-section-consent-popup-agb h-[400px] border border-gray-400 rounded-sm overflow-hidden">
                <div className="overview-section-ux-shadow-div w-full h-full p-3 overflow-y-scroll">
                  <AGBComponent />
                </div>
              </div>
              <div className="overview-section-consent-popup-accept-div mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={agbConsent}
                  onChange={(event) => {
                    setAGBConsent(event.target.checked);
                  }}
                  className="overview-section-consent-popup-input-checkbox cursor-pointer"
                  name=""
                />{" "}
                Akzeptieren
              </div>
            </div>

            <div className="overview-section-consent-popup-data-protection-div w-[95%] flex flex-col items-start justify-center gap-y-5">
              <h2 className="overview-section-consent-popup-headline text-lg">
                Datenschutzerklärung für OpenPureNet
              </h2>
              <div className="overview-section-consent-popup-data-protection h-[400px] border border-gray-400 rounded-sm overflow-hidden">
                <div className="overview-section-ux-shadow-div w-full h-full p-3 overflow-y-scroll">
                  <Dataprotection />
                </div>
              </div>
              <div className="overview-section-consent-popup-accept-div mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={dataprotectionConsent}
                  onChange={(event) => {
                    setDataprotectionConsent(event.target.checked);
                  }}
                  className="overview-section-consent-popup-input-checkbox cursor-pointer"
                  name=""
                />
                Akzeptieren
              </div>
            </div>

            <div className="overview-section-consent-popup-user-consent-div w-[95%] flex flex-col items-start justify-center gap-y-5">
              <h2 className="overview-section-consent-popup-headline text-lg">
                Einwilligung zur Datenverarbeitung durch Drittanbieter
              </h2>
              <div className="overview-section-consent-popup-user-consent px-5 py-3 text-lg border border-gray-400 rounded-sm">
                Ich willige ein, dass meine freiwilligen angegebenen
                personenbezogenen Daten (z.B. Adresse, Stadt, Telefonnummer), im
                Rahmen der Nutzung der Plattform OpenPureNet, an den
                Dienstleister SupaBase Inc. übermittelt und dort gemäß deren
                Datenschutzrichtlinien gespeichert und verarbeitet werden. Die
                Datenverarbeitung dient ausschließlich der technischen
                Bereitstellung und Sicherheit meines Nutzerkontos. Ich kann
                diese Einwilligung jederzeit widerrufen.
              </div>
              <div className="overview-section-consent-popup-accept-div mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={userDataConsent}
                  onChange={(event) => {
                    setUserDataConsent(event.target.checked);
                  }}
                  className="overview-section-consent-popup-input-checkbox cursor-pointer"
                  name=""
                />
                Akzeptieren
              </div>
            </div>

            <div className="overview-section-consent-popup-button-div w-full mb-10 pr-10 flex justify-end item gap-x-3">
              {" "}
              <button
                onClick={() => {
                  setConsentPopUp(false);
                  toSignOut();
                }}
                className="overview-section-cancel-button px-5 text-base flex justify-center items-center gap-x-1 bg-gray-200 border border-gray-300 rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="overview-section-cancel-icon w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                <span className="overview-section-cancel-label">abbrechen</span>
              </button>{" "}
              <button
                onClick={acceptConsent}
                className={`overview-section-continue-button px-7 py-1.5 text-base flex justify-center items-center gap-x-1 rounded-sm ${
                  agbConsent && dataprotectionConsent && userDataConsent
                    ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-all duration-300 ease-in-out"
                    : "bg-gray-200 border border-gray-300 text-black"
                }  `}
                disabled={
                  !(agbConsent && dataprotectionConsent && userDataConsent)
                }
              >
                {" "}
                Weiter
              </button>
            </div>
          </DialogDescription>
          <DialogClose className="flex justify-end items-center gap-x-3">
            {" "}
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Dialog open={noticePopUp} onOpenChange={setNoticePopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="notice-popup "
        >
          <DialogDescription className="flex justify-center items-center">
            <p className="notice-popup-notice p-3 text-[22px] text-black">
              Du möchtest etwas melden oder hast Angregungen für uns? Schreib
              unserem Support-Team einfach eine Mail an open-pure-net@web.de.
            </p>
          </DialogDescription>
          <DialogClose className="pr-3 py-3 flex justify-end items-center">
            {" "}
            <button
              onClick={() => {
                setNoticePopUp(false);
              }}
              className="notice-popup-close-button mr-3 px-3 py-0.5 flex justify-center items-center gap-x-1 text-lg bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <span>schließen</span>
            </button>{" "}
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Nav />

      <div className="overview-section-show-content w-full h-full grid grid-cols-3">
        <div className="overview-section-overview-placeholder"></div>

        <div className="overview-section-post-overview w-full h-213 overflow-auto">
          <div className="overview-section-post-overview-scroll-div w-full h-full px-1 flex flex-col gap-y-0.5 overflow-auto">
            {postsArray.map((post) => {
              return (
                <>
                  <Post
                    post={post}
                    openEditPostPopUp={() => {}}
                    openDeletePostPopUp={() => {}}
                    hiddenPostOptions={hiddenPostOptions}
                    postKebabMenuId={0}
                    openPostKebabMenu={() => {}}
                  />
                </>
              );
            })}
          </div>
        </div>

        <div className="overview-section-overview-placeholder2"></div>
      </div>
    </div>
  );
  /*
  id={0} name={""} text={""} picture={""} status={false}
  
  <Dialog open={noticePostPopUp} onOpenChange={setNoticePostPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=""
        >
          <DialogDescription className="p-3 text-black flex flex-col gap-y-7">
            <div className="text-lg">
              Bitte füge deinem Beitrag Inhalt hinzu oder
              <br />
              klicke auf schließen.
            </div>
            <button
              onClick={() => {
                setNoticePostPopUp(false);
              }}
              className="px-3 py-1 text-[17px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              schließen
            </button>
          </DialogDescription>
        </DialogContent>
      </Dialog>

        <div className="overview-footer w-full h-[3rem] flex justify-center items-center gap-x-3 border border-gray-200">
        <Link to="/impressum" className="cursor-pointer">
          Impressum
        </Link>
        <span className="seperate-symbole">|</span>
        <Link to="/agb" className="cursor-pointer">
          AGB
        </Link>
        <span className="seperate-symbole">|</span>
        <Link to="/data-protection" className="cursor-pointer">
          Datenschutz
        </Link>
        <span className="seperate-symbole">|</span>
        <div className="flex justify-center items-center gap-x-1">
          <a href="mailto:open-pure-net@web.de">Kontakt/Support</a>{" "}
          <Tooltip>
            <TooltipTrigger className="flex justify-center items-center">
              <button
                onClick={() => {
                  setNoticePopUp(true);
                }}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5"
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
              <p>
                {" "}
                Du möchtest etwas melden oder hast Angregungen für uns? Schreib
                unserem Support-Team einfach eine Mail an open-pure-net@web.de.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
  
  */
}
