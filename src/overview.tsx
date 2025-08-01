import "./overview.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useContext, useEffect, useRef, useState } from "react";
import { publicUserContext } from "./publicUserContext";
import type { Tables } from "./database.types";
import OpenPureNetImg from "./assets/file_00000000ee0c62439f43a8742db56e32_conversation_id=67f35b16-4744-8007-a628-17eeb6144e1f&message_id=69f1568f-bddb-48da-ad56-48b9123c8e49.png";
import Post from "./component/post";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AGBComponent from "./component/agbComponent";
import Dataprotection from "./component/dataProtectionComponent";
import { userAuthContext } from "./userAuthContext";
import { IllegalWordsArray } from "./illegalWords";
import { serachUserContext } from "./searchUserContext";
import { messageContext } from "./messageContext";
import { postsContext } from "./postContext";
import { functionContext } from "./functionContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { alphabeta_zA_ZArray } from "./alphabet";

export default function Overview() {
  const TEN_MB: number = 10 * 1000 * 1000;
  const THIRTY_FIVE_MB: number = 35 * 1000 * 1000;
  const FORTY_MB: number = 40 * 1000 * 1000;
  const [agbConsent, setAGBConsent] = useState<boolean>(false);
  const [dataprotectionConsent, setDataprotectionConsent] =
    useState<boolean>(false);
  const [userDataConsent, setUserDataConsent] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<string>("");
  const [checkTextContent, setCheckTextContent] = useState<boolean>(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [, setAvatarFileNameMessage] = useState<string>("");
  const [avatarFileMBSize, setAvatarFileMBSize] = useState<string>("");
  const [avatarFileMBMessage, setAvatarFileMBMessage] = useState<string>("");
  const [checkMediumContent, setCheckMediumContent] = useState<boolean>(false);
  const [createPostPopUp, setCreatePostPopUp] = useState<boolean>(false);
  const [inputSearchUser, setInputSearchUser] = useState<string>("");
  const [searchUserPopUp, setSearchUserPopUp] = useState<boolean>(false);
  const [illegalContentPopUp, setIllegalContentPopUp] =
    useState<boolean>(false);
  const [hiddenPostOptions] = useState<string>("hiddenPostOptions");
  const [currentSessionUserId, setCurrentSessionUserId] = useState<string>("");
  const [searchUserArray, setSerachUserArray] = useState<
    Tables<"public-user">[]
  >([]);
  const [noticePopUp, setNoticePopUp] = useState<boolean>(false);
  const { consentPopUp, setConsentPopUp } = useContext(functionContext);
  const { publicUserObject, setPublicUserObject } =
    useContext(publicUserContext);
  const { postsArray, setPostsArray } = useContext(postsContext);
  const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);
  const { searchUserObject, setSearchUserObject } =
    useContext(serachUserContext);
  const { setMessageArray, messageCount } = useContext(messageContext);
  const navigation = useNavigate();
  const resetInputFile = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session.session) {
        const sessionUserId = session.session.user.id;
        setCurrentSessionUserId(sessionUserId);
      }

      loadPosts();
    };

    fetchAllData();
  }, []);

  async function acceptConsent() {
    const { data: session } = await supabase.auth.getSession();
    const { data } = await supabase
      .from("public-user")
      .select()
      .eq("userId", session.session!.user.id);

    if (data?.length !== 0) {
      const {} = await supabase
        .from("public-user")
        .update({
          AGBConsent: agbConsent,
          dataProtectionConsent: dataprotectionConsent,
          userDataConsent: userDataConsent,
        })
        .eq("userId", data![0].userId);
      setConsentPopUp(false);
    } else {
      const {} = await supabase.from("public-user").insert({
        userId: currentSessionUserId,
        Profilname: "",
        AGBConsent: agbConsent,
        dataProtectionConsent: dataprotectionConsent,
        userDataConsent: userDataConsent,
      });
      setConsentPopUp(false);
    }
  }

  async function loadPosts() {
    const { data: posts } = await supabase
      .from("posts")
      .select(
        "id, userId, text, timestamp, medium, public_user: userId (id, userId, Profilname, profilPicture)"
      );
    //.eq("userId", publicUserObject.userId)

    console.log(posts);

    if (posts) {
      const sortedPosts = posts.sort((a, b) => b.id - a.id);
      setPostsArray(sortedPosts);
    }
  }

  async function searchUser() {
    const { data } = await supabase
      .from("public-user")
      .select()
      .ilike("Profilname", inputSearchUser);

    console.log(data);

    if (data) {
      setSerachUserArray(data);
    }
  }

  function editCreatePostInput(createPostInput: string) {
    const createPostWithoutSpace = createPostInput;
    setCreatePost(createPostWithoutSpace.trimStart());

    if (createPostWithoutSpace.trimStart().length > 0) {
      setCheckTextContent(true);
    }

    if (createPostWithoutSpace === "" || Number(avatarFileMBSize) > FORTY_MB) {
      setCheckTextContent(false);
    }
  }

  function editNewAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const MX_MB = 40;
    const MAX_BYTES = MX_MB * 1000 * 1000;

    if (file) {
      if (file.size < TEN_MB) {
        console.log(
          String(file.size).slice(0, 1) + "." + String(file.size).slice(1, 3)
        );
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 1) + "." + String(file.size).slice(1, 3)
          } MB groß und klein genug.`
        );
        setCheckTextContent(true);
        setCheckMediumContent(true);
        setNewAvatarFile(file);
      }

      if (file.size > TEN_MB && file.size < THIRTY_FIVE_MB) {
        console.log(
          String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
        );
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
          } MB groß. Das Hochladen kann einen Moment dauern.`
        );
        setCheckTextContent(true);
        setCheckMediumContent(true);
        setNewAvatarFile(file);
      }

      if (file.size > THIRTY_FIVE_MB && file.size < MAX_BYTES) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
          } MB groß und liegt innerhalb des erlaubten Limits. Das Hochladen kann einen Moment dauern.`
        );
        setCheckTextContent(true);
        setCheckMediumContent(true);
        setNewAvatarFile(file);
      }

      if (file.size >= MAX_BYTES) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
          } MB groß und überschreitet das Limit von 40 MB.`
        );
        setCheckTextContent(false);
        setCheckMediumContent(false);
        setNewAvatarFile(null);
      }
    }
  }

  async function newPost() {
    if (createPost !== "") {
      let resultIllegalContent = 0;

      for (let index = 0; index < IllegalWordsArray.length; index++) {
        resultIllegalContent = createPost.search(IllegalWordsArray[index]);

        if (resultIllegalContent !== -1) {
          break;
        }
      }

      if (resultIllegalContent !== -1) {
        setIllegalContentPopUp(true);
      } else {
        const currentTimestamp = new Date().toLocaleString();

        let mediumUrl = null;

        if (newAvatarFile) {
          let newRandomFileName = generateRandomFileName();

          const dotPosition = newAvatarFile.name.search(/\./);

          newRandomFileName =
            newRandomFileName +
            newAvatarFile.name.slice(dotPosition, newAvatarFile.name.length);

          const { data } = await supabase.storage
            .from("medium")
            .upload(`all/${newRandomFileName}`, newAvatarFile, {
              cacheControl: "3600",
              upsert: false,
            });

          mediumUrl = data;

          const {} = await supabase.from("posts").insert({
            userId: publicUserObject.userId,
            text: createPost,
            timestamp: currentTimestamp,
            medium: mediumUrl?.path,
          });

          toast.success("Dein Beitrag wurde Erfolgreich erstellt.", {
            unstyled: true,
            className: "w-[27rem] h-[5rem] px-5",
          });

          setAvatarFileNameMessage("");
          setNewAvatarFile(null);
          setCheckTextContent(false);
          setCheckMediumContent(false);
          setCreatePost("");
          loadPosts();
          setCreatePostPopUp(false);
        } else {
          const currentTimestamp = new Date().toLocaleString();

          const {} = await supabase.from("posts").insert({
            userId: publicUserObject.userId,
            text: createPost,
            timestamp: currentTimestamp,
            medium: "",
          });

          toast.success("Dein Beitrag wurde Erfolgreich erstellt.", {
            unstyled: true,
            className: "w-[27rem] h-[5rem] px-5",
          });

          setCheckTextContent(false);
          setCheckMediumContent(false);
          setCreatePost("");
          loadPosts();
          setCreatePostPopUp(false);
        }
      }
    } else {
      const currentTimestamp = new Date().toLocaleString();
      let mediumUrl = null;

      if (newAvatarFile) {
        let newRandomFileName = generateRandomFileName();
        console.log(newRandomFileName);

        const dotPosition = newAvatarFile.name.search(/\./);

        newRandomFileName =
          newRandomFileName +
          newAvatarFile.name.slice(dotPosition, newAvatarFile.name.length);
        console.log(newRandomFileName);

        const { data } = await supabase.storage
          .from("medium")
          .upload(`all/${newRandomFileName}`, newAvatarFile, {
            cacheControl: "3600",
            upsert: false,
          });

        mediumUrl = data;

        const {} = await supabase.from("posts").insert({
          userId: publicUserObject.userId,
          text: "",
          timestamp: currentTimestamp,
          medium: mediumUrl?.path,
        });

        toast.success("Dein Beitrag wurde Erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[27rem] h-[5rem] px-5",
        });

        setAvatarFileNameMessage("");
        setNewAvatarFile(null);
        setCheckTextContent(false);
        setCheckMediumContent(false);
        setCreatePost("");
        loadPosts();
        setCreatePostPopUp(false);
      }
    }
  }

  function generateRandomFileName() {
    const newRandomFileNameArray: string[] = [];

    for (let index = 0; index < 7; index++) {
      const randomCharacters =
        alphabeta_zA_ZArray[
          Math.floor(Math.random() * alphabeta_zA_ZArray.length)
        ];

      newRandomFileNameArray.push(randomCharacters);
    }

    return newRandomFileNameArray.join("");
  }

  function resetAvatarFile() {
    if (resetInputFile.current) {
      resetInputFile.current.value = "";
    }

    if (createPost !== "") {
      setCheckTextContent(true);
    } else {
      setCheckTextContent(false);
    }

    setAvatarFileNameMessage("");
    setAvatarFileMBSize("");
    setAvatarFileMBMessage("");
    setCheckMediumContent(false);
    setNewAvatarFile(null);
  }

  async function toSearchUser(userId: string) {
    const { data } = await supabase
      .from("public-user")
      .select()
      .eq("userId", userId);

    if (data) {
      const searchUserData = data[0];

      setSearchUserObject({
        ...searchUserObject,
        userId: searchUserData.userId,
        Profilname: searchUserData.Profilname,
        profilPicture: searchUserData.profilPicture,
        AGBConsent: searchUserData.AGBConsent,
        dataProtectionConsent: searchUserData.dataProtectionConsent,
        userDataConsent: searchUserData.userDataConsent,
        Statustext: searchUserData.Statustext,
        searchStatus: true,
        fromMessage: false,
      });

      navigation(`/private-route/user/${userId}`);
    }
  }

  async function signOut() {
    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      Profilname: "",
      userId: "",
      profilPicture: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      accessToken: "",
    });

    setSearchUserObject({
      ...searchUserObject,
      id: 0,
      userId: "",
      Profilname: "",
      profilPicture: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
      Statustext: "",
      searchStatus: false,
      fromMessage: false,
    });

    setMessageArray([]);

    navigation("/");
  }

  return (
    <div className="overview flex flex-col items-center justify-center">
      <Dialog open={consentPopUp} onOpenChange={setConsentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="!max-w-7xl "
        >
          <DialogDescription className=" h-[90vh] px-3 py-5 text-black flex flex-col items-center justify-center gap-y-10 overflow-y-scroll">
            <div className="mt-[40rem] flex flex-col items-start justify-center gap-y-3">
              <h2 className="text-lg">
                Allgemine Geschäftsbedingungen (AGB) von OpenPureNet
              </h2>
              <div className="h-[400px] p-3 border border-gray-400 rounded-sm overflow-y-scroll">
                <AGBComponent />
              </div>
              <div className="w-ful mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={agbConsent}
                  onChange={(event) => {
                    setAGBConsent(event.target.checked);
                  }}
                  className="cursor-pointer"
                  name=""
                />{" "}
                Akzeptieren
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-y-5">
              <h2 className="text-lg">Datenschutzerklärung für OpenPureNet</h2>
              <div className="h-[400px] p-3 border border-gray-400 rounded-sm overflow-y-scroll">
                <Dataprotection />
              </div>
              <div className="w-full mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={dataprotectionConsent}
                  onChange={(event) => {
                    setDataprotectionConsent(event.target.checked);
                  }}
                  className="cursor-pointer"
                  name=""
                />
                Akzeptieren
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-y-5">
              <h2 className="text-lg">
                Einwilligung zur Datenverarbeitung durch Drittanbieter
              </h2>
              <div className="p-3 text-lg border border-gray-400 rounded-sm">
                Ich willige ein, dass meine freiwilligen angegebenen
                personenbezogenen Daten (z.B. Adresse, Stadt, Telefonnummer), im
                Rahmen der Nutzung der Plattform OpenPureNet, an den
                Dienstleister SupaBase Inc. übermittelt und dort gemäß deren
                Datenschutzrichlinenen gespeichert und verarbeitet werden. Die
                Datenverarbeitung dient ausschließlich der technischen
                Bereitstellung und Sicherheit meines Nutzerkontos. Ich kann
                diese Einwilligung jederzeit widerrufen.
              </div>
              <div className="w-full mt-1 text-base flex justify-start items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={userDataConsent}
                  onChange={(event) => {
                    setUserDataConsent(event.target.checked);
                  }}
                  className="cursor-pointer"
                  name=""
                />
                Akzeptieren
              </div>
            </div>

            <div className="w-full mb-10 pr-10 flex justify-end item gap-x-3">
              {" "}
              <button
                onClick={() => {
                  setConsentPopUp(false);
                  signOut();
                }}
                className="px-3 py-1 text-base flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
              <button
                onClick={acceptConsent}
                className={`px-5 py-1 text-base flex justify-center items-center gap-x-1 rounded-sm ${
                  agbConsent === true &&
                  dataprotectionConsent === true &&
                  userDataConsent === true
                    ? "bg-blue-400 text-white border border-white hover:bg-white hover:text-blue-400 hover:border-blue-400 cursor-pointer"
                    : "bg-gray-300 text-black"
                }  `}
                disabled={
                  agbConsent === true &&
                  dataprotectionConsent === true &&
                  userDataConsent === true
                    ? false
                    : true
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

      <Dialog open={searchUserPopUp} onOpenChange={setSearchUserPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="w-[500px] h-[90%]"
        >
          <DialogDescription className="py-5 flex flex-col items-center justify-center gap-y-7">
            <div className="flex justify-center items-center gap-x-5">
              <input
                type="text"
                value={inputSearchUser}
                onChange={(event) => {
                  setInputSearchUser(event.target.value);
                }}
                name=""
                className="w-[17rem] h-[3.2rem] pl-3 text-xl border border-gray-400 rounded-sm"
                placeholder="Profilnamen eingeben"
              />
              <button
                onClick={searchUser}
                className="mx-auto px-5 py-3 text-lg flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </button>
            </div>
            <div className="w-[90%] h-full p-5 gap-y-3 bg-gray-50 overflow-y-scroll border border-gray-400 rounded-sm">
              {searchUserArray.map((searchUser) => {
                return (
                  <div
                    onClick={() => {
                      toSearchUser(searchUser.userId);
                    }}
                    className="p-5 flex bg-white justify-start items-center gap-x-3 shadow-lg border border-gray-300 cursor-pointer rounded-sm"
                  >
                    <img
                      src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${searchUser.profilPicture}`}
                      className="w-13 h-13 bg-cover rounded-full"
                      alt=""
                    />
                    <p className="text-lg">{searchUser.Profilname}</p>
                  </div>
                );
              })}
            </div>

            <div>
              {" "}
              <button
                onClick={() => {
                  setInputSearchUser("");
                  setSerachUserArray([]);
                  setSearchUserObject({
                    ...searchUserObject,
                    searchStatus: false,
                  });
                  setSearchUserPopUp(false);
                }}
                className="mr-3 px-2 py-0.5 flex justify-center items-center gap-x-1 text-lg bg-gray-50 text-black border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
                schließen
              </button>{" "}
            </div>
          </DialogDescription>
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

      <Dialog open={createPostPopUp} onOpenChange={setCreatePostPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=""
        >
          <DialogDescription className="p-x-3 pt-3 pb-1">
            <textarea
              value={createPost}
              onChange={(event) => {
                editCreatePostInput(event.target.value);
              }}
              className="w-full h-[250px] text-black text-lg px-5 py-3 overflow-y-scroll resize-none"
              name=""
            ></textarea>
            <div className="flex justify-center items-center">
              <input
                type="file"
                onChange={editNewAvatarFile}
                ref={resetInputFile}
                className="w-full bg-white text-base text-gray-700
        file:me-4 file:py-1.5 file:px-5
        file:rounded-sm file:border-0
        file:text-base 
        file:bg-blue-400 file:text-white
        hover:file:bg-white hover:file:border-blue-400 hover:file:text-blue-400
        file:disabled:opacity-50 file:disabled:pointer-events-none
       cursor-pointer border border-gray-200 rounded-sm"
                name=""
                id=""
              />

              <button
                onClick={resetAvatarFile}
                className="px-5 py-[7px] text-base flex justify-center items-center gap-x-1 rounded-sm bg-blue-400 border text-white border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
              >
                <span>❌</span>Entfernen
              </button>
            </div>

            <div
              className={`px-3 py-1.5 text-base flex justify-start items-center border border-gray-100 rounded-sm ${
                avatarFileMBSize === ""
                  ? "text-black"
                  : Number(avatarFileMBSize) < TEN_MB
                  ? "bg-gray-50 text-green-600"
                  : Number(avatarFileMBSize) > TEN_MB &&
                    Number(avatarFileMBSize) < THIRTY_FIVE_MB
                  ? "bg-gray-50 text-green-600"
                  : Number(avatarFileMBSize) > THIRTY_FIVE_MB &&
                    Number(avatarFileMBSize) < FORTY_MB
                  ? "bg-yellow-200 text-black"
                  : Number(avatarFileMBSize) >= FORTY_MB
                  ? "bg-gray-50 text-red-600"
                  : ""
              }`}
            >
              {avatarFileMBMessage !== ""
                ? avatarFileMBMessage
                : "Maximale Dateigröße: 40 MB"}{" "}
              {avatarFileMBSize === ""
                ? ""
                : Number(avatarFileMBSize) < TEN_MB
                ? "✅"
                : Number(avatarFileMBSize) > TEN_MB &&
                  Number(avatarFileMBSize) < THIRTY_FIVE_MB
                ? "✅"
                : Number(avatarFileMBSize) > THIRTY_FIVE_MB &&
                  Number(avatarFileMBSize) < FORTY_MB
                ? "⚠️"
                : Number(avatarFileMBSize) >= FORTY_MB
                ? "❌"
                : ""}
            </div>

            <div className="mt-5 flex justify-end items-center gap-x-3">
              <button
                onClick={() => {
                  setCreatePost("");
                  setAvatarFileNameMessage("");
                  setAvatarFileMBSize("");
                  setAvatarFileMBMessage("");
                  setCheckTextContent(false);
                  setCheckMediumContent(false);
                  setCreatePostPopUp(false);
                }}
                className="px-3 py-1.5 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
                schließen
              </button>{" "}
              <button
                onClick={newPost}
                disabled={
                  checkTextContent === true || checkMediumContent === true
                    ? false
                    : true
                }
                className={`px-5 py-1.5 text-[17px] flex justify-center items-center gap-x-1 rounded-sm ${
                  checkTextContent === true || checkMediumContent === true
                    ? "bg-blue-400 border text-white border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                    : "bg-gray-200"
                } `}
              >
                <div className="flex justify-center items-center">
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
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
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>{" "}
                Beitrag erstellen
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={illegalContentPopUp} onOpenChange={setIllegalContentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=""
        >
          <DialogDescription className="px-5 pt-3 pb-1 text-black">
            <p className="text-xl">
              <span className="text-2xl text-red-500">Achtung</span>
              <br />
              In deinem Beitrag wurde problematischer Inhalt entdeckt. Bitte
              überprüfe und korriege ihn.
            </p>
            <button
              onClick={() => {
                setIllegalContentPopUp(false);
              }}
              className="mx-auto mt-7 mb-3 px-3 py-1 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
              schließen
            </button>{" "}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={noticePopUp} onOpenChange={setNoticePopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="w-[500px] h-[250px]"
        >
          <DialogDescription className="flex justify-center items-center">
            <p className="text-[22px] text-black">
              Du möchtest etwas melden oder hast Angregungen für uns? Schreib
              unserem Support-Team einfach eine Mail an open-pure-net@web.de.
            </p>
          </DialogDescription>
          <DialogClose className="flex justify-end items-center">
            {" "}
            <button
              onClick={() => {
                setNoticePopUp(false);
              }}
              className="mr-3 px-2 py-0.5 flex justify-center items-center gap-x-1 text-lg bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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

      <nav className="w-full py-3 flex justify-center items-center gap-x-3 border border-gray-200 rounded-sm">
        <img src={OpenPureNetImg} className="w-25 rounded-full" alt="" />{" "}
        <button
          onClick={() => {
            setSearchUserPopUp(true);
          }}
          className="px-3 flex flex-col items-center justify-center hover:text-blue-500 rounded-sm cursor-pointer"
        >
          {" "}
          <div className="flex justify-center items-center">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <span> User suchen</span>
        </button>
        <Link
          to="/private-route/message"
          className="px-5 py-1 flex flex-col items-center justify-center hover:text-blue-500 rounded-sm cursor-pointer"
        >
          {messageCount > 0 ? (
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
              className="w-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          )}
          <span
            className={`text-lg ${
              messageCount > 0 ? "px-3 bg-red-500 rounded-[50%]" : ""
            }`}
          >
            {messageCount === 0 ? "" : messageCount}
          </span>
          Mitteilungen
        </Link>
        <Link
          to={`/private-route/user/${publicUserObject.userId}`}
          className="to-user-link px-3.5 py-1 flex flex-col items-center justify-center hover:text-blue-400 rounded-sm cursor-pointer"
        >
          {publicUserObject.profilPicture !== "" ? (
            <img
              src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${publicUserObject.profilPicture}`}
              className="w-13 h-13 bg-cover rounded-full"
              alt=""
            />
          ) : (
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          )}{" "}
          <span className="text-lg">
            {publicUserObject.Profilname !== ""
              ? publicUserObject.Profilname
              : "User"}
          </span>
        </Link>
        <button
          onClick={signOut}
          className="px-3 flex flex-col items-center justify-center hover:text-blue-400 rounded-sm cursor-pointer"
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
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
            />
          </svg>
          Ausloggen
        </button>
      </nav>
      <div className="w-full flex justify-around center-content py-5 bg-white"></div>

      <div className="show-content w-full h-190.7 grid grid-cols-3 bg-white">
        <div></div>
        <div className="post-overview-div">
          <button
            onClick={() => {
              setCreatePostPopUp(true);
            }}
            className="mx-auto mt-3 px-5 py-3 text-lg flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-7"
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
                className="w-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>

            <span className="text-lg">Beitrag erstellen</span>
          </button>
          <div className="post-overview w-full h-171 mt-3 pt-1 px-3 flex flex-col gap-y-1 bg-gray-50 border border-l-gray-300 border-r-gray-300 border-t-white border-b-white overflow-y-scroll">
            {postsArray.map((post) => {
              return (
                <>
                  <Post
                    post={post}
                    openEditPostPopUp={() => {}}
                    openDeletePostPopUp={() => {}}
                    hiddenPostOptions={hiddenPostOptions}
                  />
                </>
              );
            })}
          </div>
        </div>
        <div></div>
      </div>
      <div className="w-full py-2 flex justify-center items-center gap-x-3 border border-gray-200">
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
  );
  /*<Dialog open={noticePostPopUp} onOpenChange={setNoticePostPopUp}>
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
  
  */
}
