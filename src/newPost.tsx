import "./newPost.css";
import Nav from "./nav";
import { useContext, useEffect, useRef, useState } from "react";
import { navContext } from "./navContext";
import { IllegalWordsArray } from "./illegalWords";
import { alphabeta_zA_ZArray } from "./alphabet";
import { supabase } from "./supabase";
import { publicUserContext } from "./publicUserContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
/*import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "./components/ui/dialog";*/
import { useNavigate } from "react-router-dom";
import { mediumCategoryArray } from "./mediumCategory";

export default function NewPost() {
  const TEN_MB: number = 10 * 1000 * 1000;
  const THIRTY_FIVE_MB: number = 35 * 1000 * 1000;
  const FOURTY_MB: number = 40 * 1000 * 1000;

  const [createPost, setCreatePost] = useState<string>("");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [, setAvatarFileNameMessage] = useState<string>("");
  const [avatarFileMBMessage, setAvatarFileMBMessage] = useState<string>("");
  const [avatarFileMBSize, setAvatarFileMBSize] = useState<string>("");
  const resetInputFile = useRef<HTMLInputElement | null>(null);
  const [mediumCategory, setMediumCategory] = useState<number>(0);
  const { publicUserObject } = useContext(publicUserContext);
  /*const [noSupportContentPopUp, setNoSupportContentPopUp] =
    useState<boolean>(false);*/
  const [inlineModerationNote, setInlineModerationNote] =
    useState<boolean>(false);
  //const [, setNoSupportContentMessage] = useState<string>("");
  const { setCurrentActiveNavArea } = useContext(navContext);
  const navigation = useNavigate();

  useEffect(() => {
    setCurrentActiveNavArea("post");
    setAvatarFileMBMessage(mediumCategoryArray[0].text(0));

    return () => {
      setCreatePost("");
      setNewAvatarFile(null);
      setAvatarFileMBSize("");
      setAvatarFileMBMessage("");
      setAvatarFileNameMessage("");
      setInlineModerationNote(false);
    };
  }, []);

  [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>,
  ];

  function editNewAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (file.size > 0 && file.size < TEN_MB) {
        /*console.log(
          String(file.size).slice(0, 1) + "." + String(file.size).slice(1, 3),
        );*/
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[1].text(file.size));
        setMediumCategory(1);
      }

      if (file.size > TEN_MB && file.size < THIRTY_FIVE_MB) {
        /*console.log(
          String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3),
        );*/
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[2].text(file.size));
        setMediumCategory(2);
      }

      if (file.size > THIRTY_FIVE_MB && file.size < FOURTY_MB) {
        //console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[3].text(file.size));
        setMediumCategory(3);
      }

      if (file.size >= FOURTY_MB) {
        //console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[4].text(file.size));
        setMediumCategory(4);
      }

      setNewAvatarFile(file);
    }
  }

  function resetAvatarFile() {
    if (resetInputFile.current) {
      resetInputFile.current.value = "";
    }

    console.log(mediumCategoryArray[0].text);
    setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
    setMediumCategory(0);
    setAvatarFileNameMessage("");
    setAvatarFileMBSize("");
    setNewAvatarFile(null);
  }

  async function createNewPost() {
    let resultIllegalContent = 0;

    for (let index = 0; index < IllegalWordsArray.length; index++) {
      resultIllegalContent = createPost.search(IllegalWordsArray[index]);

      if (resultIllegalContent !== -1) {
        break;
      }
    }

    if (resultIllegalContent !== -1) {
      //setNoSupportContentPopUp(true);
      setInlineModerationNote(true);
    } else {
      if (newAvatarFile) {
        const currentTimestamp = new Date().getTime();
        let mediumUrl = null;
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
          user_id: publicUserObject.user_id,
          text: createPost,
          time_stamp: String(currentTimestamp),
          medium: mediumUrl?.path,
        });

        setAvatarFileNameMessage("");
        setAvatarFileMBMessage("");
        setAvatarFileMBSize("");
        setNewAvatarFile(null);
        setCreatePost("");
        navigation("/private-route/overview");
      } else {
        const currentTimestamp = new Date().toLocaleString();

        const {} = await supabase.from("posts").insert({
          user_id: publicUserObject.user_id,
          text: createPost,
          time_stamp: currentTimestamp,
          medium: "",
        });

        setCreatePost("");
        navigation("/private-route/overview");
      }

      toast.success("Dein Beitrag wurde Erfolgreich erstellt.", {
        unstyled: true,
        className: "w-[20rem] h-[6rem] px-5",
      });
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

  return (
    <section className="new-post-section h-screen">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "user-toasty flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />
      <Nav />
      <div className="w-[50%] h-[15rem] mt-30 mx-auto shadow-lg">
        <textarea
          value={createPost}
          onChange={(event) => {
            setCreatePost(event.target.value.trimStart());
          }}
          onFocus={() => {
            setInlineModerationNote(false);
          }}
          className="create-post-popup-textarea w-full h-full bg-white text-black text-lg px-5 py-3 rounded-sm border border-gray-400 overflow-y-scroll resize-none"
          placeholder="Was möchtest du teilen?"
          name=""
        ></textarea>
      </div>

      <div className="w-[50%] mt-10 mx-auto bg-white p-5 flex flex-col gap-y-1.5 border border-gray-400 shadow-lg rounded-sm">
        {inlineModerationNote && (
          <div className="text-red-500 text-lg">
            {" "}
            <p className="text-red-500 text-xl"> Achtung</p> In deinem Beitrag
            wurde problematischer Inhalt gefunden, bitte überprüfe deine Eingabe
            und korrigiere sie gegebenenfalls.
          </div>
        )}
        <div className="create-post-popup-input-button-div flex justify-center items-center gap-x-1.5">
          <input
            type="file"
            onChange={editNewAvatarFile}
            ref={resetInputFile}
            className="user-section__create-post-input-file w-full  text-base text-gray-700
        file:me-4 file:py-1.5 file:px-5
        file:rounded-sm file:border-0
        file:text-base 
         file:transition-all duration-300 ease-in-out
        file:cursor-pointer
        file:bg-blue-500 file:text-white
        hover:file:bg-white hover:file:border-blue-500 hover:file:text-blue-500
        file:disabled:opacity-50 file:disabled:pointer-events-none
       cursor-pointer border border-gray-200 rounded-sm"
            name=""
            id=""
          />

          <button
            onClick={() => {
              resetAvatarFile();
            }}
            disabled={newAvatarFile !== null ? false : true}
            className={`create-post-popup-reset-input-button px-5 py-[6px] text-base flex justify-center items-center gap-x-1 rounded-sm ${newAvatarFile !== null ? "bg-red-600 border text-white border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600" : "bg-gray-200 border border-gray-300"} `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="create-post-remove-avatar-file-button w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            Entfernen
          </button>
        </div>
        <div
          className={`create-post-popup-mb-message px-3 py-1.5 text-base flex justify-start items-center border border-gray-100 rounded-sm ${mediumCategoryArray[mediumCategory].design}`}
        >
          {avatarFileMBMessage} {mediumCategoryArray[mediumCategory].svg}
        </div>
        <div className="create-post-popup-button-div mt-5 flex justify-end items-center gap-x-5">
          <button
            onClick={() => {
              setCreatePost("");
              setNewAvatarFile(null);
              setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
              setMediumCategory(0);
              setAvatarFileMBSize("");
              setAvatarFileNameMessage("");
              if (resetInputFile.current) {
                resetInputFile.current.value = "";
              }
              setInlineModerationNote(false);
            }}
            className="create-post-popup-close-button px-3 py-1.5 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-200 border border-gray-300 rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-white"
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
            abbrechen
          </button>{" "}
          <button
            onClick={createNewPost}
            disabled={
              !(
                (createPost.length > 0 &&
                  Number(avatarFileMBSize) < FOURTY_MB) ||
                (newAvatarFile !== null && Number(avatarFileMBSize) < FOURTY_MB)
              )
            }
            className={`create-post-popup-create-button px-5 py-1.5 text-[17px] flex justify-center items-center gap-x-1 rounded-sm ${
              (createPost.length > 0 && Number(avatarFileMBSize) < FOURTY_MB) ||
              (newAvatarFile !== null && Number(avatarFileMBSize) < FOURTY_MB)
                ? "bg-blue-500 border text-white border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500"
                : "bg-gray-200 border border-gray-300"
            } `}
          >
            {" "}
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="create-post-popup-plus-icon w-5"
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
                className="create-post-popup-paper-icon w-5"
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
        </div>{" "}
      </div>
    </section>
  );

  /* <Dialog
        open={noSupportContentPopUp}
        onOpenChange={setNoSupportContentPopUp}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="no-suppot-content-popup !max-w-xl"
        >
          <DialogDescription className="no-suppot-content-popup-description px-5 pt-3 pb-1 text-black">
            <p className="no-suppot-content-popup-attention text-2xl text-red-500">
              Achtung
            </p>
            <br />
            <p className="no-suppot-content-popup-text "></p>
            <button
              onClick={() => {
                setNoSupportContentMessage("");
                setNoSupportContentPopUp(false);
              }}
              className="no-suppot-content-popup-close-button mx-auto mt-7 mb-3 px-3 py-1 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="no-suppot-content-popup-close-icon w-5"
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
  
  */
}
