import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import OpenPureNetImg from "./assets/file_00000000ee0c62439f43a8742db56e32_conversation_id=67f35b16-4744-8007-a628-17eeb6144e1f&message_id=69f1568f-bddb-48da-ad56-48b9123c8e49.png";
import { useContext, useEffect, useState } from "react";
import { messageContext } from "./messageContext";
import { userAuthContext } from "./userAuthContext";
import { navContext } from "./navContext";
import { supabase } from "./supabase";
import { publicUserContext } from "./publicUserContext";
import { postsContext } from "./postContext";
import { searchUserContext } from "./searchUserContext";
import "./responsive.css";

/*interface SearchUserDatatype {
  id: number;
  name: string;
  text: string;
  picture: string;
  status: boolean;
}*/

export default function Nav() {
  //searchUserObject: SearchUserDatatype
  const { messageCount } = useContext(messageContext);
  const [userOptions, setUserOptions] = useState<boolean>(false);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const { currentActiveNavArea, setCurrentActiveNavArea } =
    useContext(navContext);
  const { publicUserObject, setPublicUserObject } =
    useContext(publicUserContext);
  const { setUserAuthObject } = useContext(userAuthContext);
  const { setPostsArray } = useContext(postsContext);
  const { globalSearchUserObject } = useContext(searchUserContext);
  const navigation = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session.session) {
        setSessionUserId(session.session.user.id);
      }
    };

    console.log(publicUserObject);
    loadSession();
  });

  function toUser() {
    setPostsArray([]);
    navigation(`/private-route/user/${publicUserObject.user_id}`);
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut();
    setCurrentActiveNavArea("");
    console.log(error);

    setPublicUserObject({
      ...publicUserObject,
      profil_name: "",
      user_id: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
    });

    setUserAuthObject(null);
    navigation("/");
  }

  return (
    <nav className="nav-section h-[5.1rem] w-full mb-0.5 bg-white flex justify-center items-center gap-x-10 shadow-md">
      <img
        src={OpenPureNetImg}
        className="nav-section-logo-img w-20 rounded-full"
        alt=""
      />{" "}
      <Link
        to="/private-route/overview"
        onClick={() => {
          setUserOptions(false);
          setCurrentActiveNavArea("overview");
        }}
        className="nav-section-to-overview-link h-full"
      >
        <div className="nav-section-mobile-active-nav-div">
          <div className="nav-section-icon-description-div h-[4.8rem] flex flex-col items-center justify-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`nav-section-home-icon w-7 transition-all duration-300 ease-in-out hover:text-blue-500 ${currentActiveNavArea === "overview" ? "text-blue-500" : ""}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="nav-section-overview-label text-[1.1rem] interaction-label">
              Home
            </span>
          </div>{" "}
          <div
            className={`nav-section-current-active-nav-div w-full h-[3px] ${currentActiveNavArea === "overview" ? "bg-blue-500" : ""}`}
          ></div>
        </div>
      </Link>
      <Link
        to="/private-route/users"
        onClick={() => {
          setPostsArray([]);
          setUserOptions(false);
          setCurrentActiveNavArea("users");
        }}
        className="nav-section-to-search-users-link rounded-sm cursor-pointer"
      >
        <div className="nav-section-mobile-active-nav-div">
          <div className="nav-section-icon-description-div h-[4.8rem] flex flex-col items-center justify-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`nav-section-users-icon w-7 transition-all duration-300 ease-in-out hover:text-blue-500 ${currentActiveNavArea === "users" ? "text-blue-500" : ""}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <span className="nav-section-search-users-label text-[1.1rem] interaction-label">
              Users
            </span>
          </div>{" "}
          <div
            className={`nav-section-current-active-nav-div w-full h-[3px] ${currentActiveNavArea === "users" ? "bg-blue-500" : ""}`}
          ></div>
        </div>
      </Link>{" "}
      <div className="nav-section-new-post-button-div flex flex-col items-center justify-center">
        <div className="nav-section-mobile-active-nav-div">
          <div className="nav-section-icon-description-div h-[4.8rem] flex flex-col items-center justify-center">
            <button
              onClick={() => {
                setUserOptions(false);

                setCurrentActiveNavArea("post");
                navigation("/private-route/post");
              }}
              className="nav-section-new-post-button px-3 py-2 text-lg bg-blue-500 text-white transition-all duration-500 ease-in-out border border-blue-500 cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500 rounded-sm"
            >
              <div className="flex justify-center items-center gap-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="nav-section-plus-icon w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="nav-section-paper-icon w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
            </button>
            <span className="nav-section-new-post-button-label text-[1.1rem] interaction-label text-base">
              Beitrag erstellen
            </span>
          </div>

          <div
            className={`nav-section-current-active-nav-div w-full h-[3px] ${currentActiveNavArea === "post" ? "bg-blue-500" : ""}`}
          ></div>
        </div>
      </div>
      <Link
        to="/private-route/message"
        onClick={() => {
          setUserOptions(false);
          setCurrentActiveNavArea("message");
        }}
        className="nav-section-to-message-link cursor-pointer"
      >
        <div className="nav-section-mobile-active-nav-div">
          <div className="nav-section-icon-description-div h-[4.8rem] relative flex flex-col items-center justify-center">
            {" "}
            {messageCount > 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`nav-section-ring-bell-icon w-7 transition-all duration-300 ease-in-out hover:text-blue-500 ${currentActiveNavArea === "message" ? "text-blue-500" : ""}`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`nav-section-bell-icon w-7 transition-all duration-300 ease-in-out hover:text-blue-500 ${currentActiveNavArea === "message" ? "text-blue-500" : ""}`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            )}
            <span
              className={`nav-section-new-message interaction-name absolute top-[0] left-14 text-[1rem] ${
                messageCount > 0 ? "px-2 py-[1px] bg-red-600 rounded-[50%]" : ""
              }`}
            >
              {messageCount > 0 ? messageCount : null}
            </span>
            <span className="nav-section-new-message-label text-[1.1rem] interaction-label">
              Mitteilungen
            </span>
          </div>

          <div
            className={`nav-section-current-active-nav-div w-full h-[3px] ${currentActiveNavArea === "message" ? "bg-blue-500" : ""}`}
          ></div>
        </div>
      </Link>
      <div className="nav-section-to-user-div relative">
        <div className="nav-section-mobile-active-nav-div">
          <div
            onClick={() => {
              setUserOptions(!userOptions);
            }}
            className="nav-section-icon-description-div h-[4.8rem] flex flex-col items-center justify-center cursor-pointer"
          >
            {globalSearchUserObject.search_status &&
            globalSearchUserObject.profil_picture !== "" ? (
              <img
                src={`https://pmhsscblwzipolnmirow.supabase.co/storage/v1/object/public/profilepicture/${globalSearchUserObject.profil_picture}`}
                className="nav-section-user-picture w-9 h-9 bg-cover rounded-full"
                alt=""
              />
            ) : (globalSearchUserObject.search_status &&
                globalSearchUserObject.profil_picture === "") ||
              publicUserObject.profil_picture === "" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`nav-section-user-icon w-8 h-8 ${currentActiveNavArea === "user" ? "text-blue-500" : ""}`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            ) : (
              <img
                src={`https://pmhsscblwzipolnmirow.supabase.co/storage/v1/object/public/profilepicture/${publicUserObject.profil_picture}`}
                className="nav-section-user-picture w-10 h-10 bg-cover rounded-full"
                alt=""
              />
            )}{" "}
            <span className="nav-section-user-name interaction-label text-[1.1rem]">
              {globalSearchUserObject.search_status &&
              globalSearchUserObject.profil_name !== ""
                ? globalSearchUserObject.profil_name
                : (globalSearchUserObject.search_status &&
                      globalSearchUserObject.profil_name === "") ||
                    publicUserObject.profil_name === ""
                  ? "User"
                  : publicUserObject.profil_name}
            </span>
            <div className="nav-section-user-options-icon-div absolute top-[1.5rem] left-[2.2rem] w-6 h-6 flex justify-center items-center rounded-[50%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`nav-section-user-options-icon w-5 transition-all duration-500 ease-in-out ${userOptions ? "rotate-[-180deg]" : ""} cursor-pointer`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`nav-section-user-mobile-options-icon w-5 transition-all duration-500 ease-in-out cursor-pointer`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </div>
          </div>

          <div
            className={`nav-section-user-options-div fixed w-[15rem] transition-all duration-700 ease-in-out z-[1] p-2 shadow-lg rounded-sm ${userOptions ? "nav-section-user-options-animation-div" : ""}`}
          >
            <div className="nav-section-user-options-child-div py-5 pl-5 bg-white flex flex-col gap-y-4 rounded-sm">
              <button
                onClick={() => {
                  toUser();
                  setUserOptions(false);
                  setCurrentActiveNavArea("user");
                }}
                className="nav-section-user-button flex gap-x-2 transition-all duration-300 ease-in-out hover:text-blue-500 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className={`nav-section-user-component-icon w-6 ${currentActiveNavArea === "user" ? "text-blue-500" : ""}`}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <p
                  className={`nav-section-user-label text-[17px] ${currentActiveNavArea === "user" ? "text-blue-500" : ""}`}
                >
                  Meine Übersicht
                </p>
              </button>
              {globalSearchUserObject.search_status ? null : globalSearchUserObject.from_message ? null : publicUserObject.user_id ===
                sessionUserId ? (
                <Link
                  to={`/private-route/settings/${publicUserObject.user_id}`}
                  onClick={() => {
                    setUserOptions(false);
                    setCurrentActiveNavArea("settings");
                  }}
                  className="nav-section-to-settings-link flex gap-x-2 transition-all duration-300 ease-in-out hover:text-blue-500 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className={`nav-section-to-settings-icon w-6 ${currentActiveNavArea === "settings" ? "text-blue-500" : ""}`}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <p
                    className={`nav-section-settings-label text-[17px] ${currentActiveNavArea === "settings" ? "text-blue-500" : ""}`}
                  >
                    Einstellungen
                  </p>
                </Link>
              ) : null}
              <button
                onClick={() => {
                  logOut();
                  setUserOptions(false);
                }}
                className="nav-section-logout-button flex gap-x-2 border-none cursor-pointer transition-all duration-300 ease-in-out hover:text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="nav-section-logout-icon w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>

                <span className="nav-section-logout-label text-[17px]">
                  Ausloggen
                </span>
              </button>
            </div>
          </div>
          <div
            className={`nav-section-current-active-nav-div w-full h-[3px] ${currentActiveNavArea === "user" || currentActiveNavArea === "settings" ? "bg-blue-500" : ""}`}
          ></div>
        </div>
      </div>
    </nav>
  );

  /* : searchUserObject.status === true &&
                    searchUserObject.name === ""
                  ? "User"
                  : searchUserObject.status === true &&
                      searchUserObject.name !== ""
                    ? searchUserObject.name
                    
                    
                    searchUserObject.status === true &&
            searchUserObject.picture === "" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`user-icon w-8 h-8 ${currentActiveNavArea === "user" ? "text-blue-500" : ""}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          ) : searchUserObject.status === true &&
            searchUserObject.picture !== "" ? (
            <img
              src={`https://pmhsscblwzipolnmirow.supabase.co/storage/v1/object/public/profilepicture/${searchUserObject.picture}`}
              className="user-picture w-9 h-9 bg-cover rounded-full"
              alt=""
            />
          ) :
           
          : searchUserObject.status ? null 
  
  */
}
