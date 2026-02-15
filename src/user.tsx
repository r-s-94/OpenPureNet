import { useParams } from "react-router-dom";
import "./user.css";
import { useEffect, useContext, useState, useRef } from "react";
import { publicUserContext } from "./publicUserContext";
import { supabase } from "./supabase";
import type { Tables } from "./database.types";
import Post from "./component/post";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription } from "./components/ui/dialog";
import { IllegalWordsArray } from "./illegalWords";
import { searchUserContext } from "./searchUserContext";
import Follow from "./component/follow";
import { postsContext } from "./postContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { alphabeta_zA_ZArray } from "./alphabet";
import "./responsive.css";
import Nav from "./nav";
import { navContext } from "./navContext";
import { mediumCategoryArray } from "./mediumCategory";

export default function User() {
  /*interface SearchUserDatatype {
    id: number;
    name: string;
    text: string;
    picture: string;
    status: boolean;
  }*/

  const TEN_MB: number = 10 * 1000 * 1000;
  const THIRTY_FIVE_MB: number = 35 * 1000 * 1000;
  const FOURTY_MB: number = 40 * 1000 * 1000;
  const [, setCommentsArray] = useState<Tables<"comments">[]>([]);
  const [hiddenPostOptions] = useState<string>("");
  //const [noticePostPopUp, setNoticePostPopUp] = useState<boolean>(false);
  const [updatePost, setUpdatePost] = useState<string>("");
  const [updateAvatarFile, setUpdateAvatarFile] = useState<File | null>(null);
  const [mediumCategory, setMediumCategory] = useState<number>(0);
  const [, setAvatarFileNameMessage] = useState<string>("");
  const [avatarFileMBMessage, setAvatarFileMBMessage] = useState<string>("");
  const [avatarFileMBSize, setAvatarFileMBSize] = useState<string>("");
  //const [avatarFileMessage, setAvatarFileMessage] = useState<string>("");
  const [updatePostPopUp, setUpdatePostPopUp] = useState<boolean>(false);
  /*const [noticeUpdatePostPopUp, setNoticeUpdatePostPopUp] =
    useState<boolean>(false);*/
  const [currentPostId, setCurrentPostId] = useState<number>(0);
  const [postKebabMenuId, setPostKebabMenuId] = useState<number>(0);
  const [prevPostKebabMenuId, setPrevPostKebabMenuId] = useState<number>(0);
  const [deletePostPopUp, setDeletePostPopUp] = useState<boolean>(false);
  const [inlineModerationNote, setInlineModerationNote] =
    useState<boolean>(false);
  /*const [noSupportContentPopUp, setNoSupportContentPopUp] =
    useState<boolean>(false);*/
  //const [, setNoSupportContentMessage] = useState<string>("");
  //const [noticeMessage, setNoticeMessage] = useState<string>("");
  //const [noticePopUp, setNoticePopUp] = useState<boolean>(false);
  const [follow, setFollow] = useState<boolean | null>(false);
  const [followId, setFollowId] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  //const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);
  const { publicUserObject } = useContext(publicUserContext);
  //const { loadAllUserData } = useContext(functionContext);
  const { postsArray, setPostsArray } = useContext(postsContext);
  const { globalSearchUserObject, setGlobalSearchUserObject } =
    useContext(searchUserContext);
  const { setCurrentActiveNavArea } = useContext(navContext);
  const { userId } = useParams();
  const resetInputFile = useRef<HTMLInputElement | null>(null);
  /*const [searchUserObject, setSearchUserObject] = useState<SearchUserDatatype>({
    id: 0,
    name: "",
    text: "",
    picture: "",
    status: false,
  });*/

  useEffect(() => {
    console.log(publicUserObject);
    const fetchAllUserData = async () => {
      console.log(userId);

      const { data: session } = await supabase.auth.getSession();
      /*const currentURL = window.location.href;
      console.log(currentURL);
      const userIDInURL = currentURL.slice(41, 77);
      console.log(userIDInURL);*/

      //console.log(navObject);
      //console.log(publicUserObject);

      if (userId !== session.session?.user.id) {
        const { data } = await supabase
          .from("public_user")
          .select()
          .eq("user_id", userId!);

        if (data) {
          const searchUserData = data[0];
          //console.log(searchUserObject);

          /*setSearchUserObject({
            ...searchUserObject,
            id: searchUserData.id,
            name: searchUserData.profil_name,
            text: searchUserData.status_text,
            picture: searchUserData.profil_picture,
            status: true,
          });*/

          setGlobalSearchUserObject({
            ...globalSearchUserObject,
            user_id: searchUserData.user_id,
            profil_name: searchUserData.profil_name,
            profil_picture: searchUserData.profil_picture,
            status_text: searchUserData.status_text,
            search_status: true,
          });
        }

        const { data: userFollowOptions } = await supabase
          .from("follow")
          .select()
          .eq("user_id", publicUserObject.user_id)
          .eq("follow", true)
          .eq("follow_user_id", userId!);

        if (userFollowOptions && userFollowOptions.length > 0) {
          setFollowId(userFollowOptions[0].id);
          setFollow(userFollowOptions[0].follow);
        }
      }

      setCurrentActiveNavArea("user");

      //loadAllUserData();

      const { data: posts } = await supabase
        .from("posts")
        .select(
          "id, user_id, text, time_stamp, medium, public_user: user_id (id, user_id, profil_name, profil_picture)",
        )
        .eq("user_id", userId!);

      console.log(posts);

      const { data: comments } = await supabase.from("comments").select();

      const { count: followers } = await supabase
        .from("follow")
        .select("*", { count: "exact", head: true })
        .eq("follow_user_id", userId!)
        .eq("follow", true);

      //console.log(followersCount);

      const { count: following } = await supabase
        .from("follow")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("follow", true);

      if (posts && posts.length > 0) {
        console.log(posts);
        const sortedPosts = posts.sort((a, b) => b.id - a.id);
        setPostsArray(sortedPosts);
      }

      if (comments) {
        const sortedCommenst = comments.sort((a, b) => b.id - a.id);
        setCommentsArray(sortedCommenst);
      }

      if (followers) {
        setFollowers(followers);
      } else {
        setFollowers(0);
      }

      if (following) {
        setFollowing(following);
      } else {
        setFollowing(0);
      }

      setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
    };

    fetchAllUserData();

    return () => {
      setGlobalSearchUserObject({
        ...globalSearchUserObject,
        user_id: "",
        profil_name: "",
        profil_picture: "",
        agb_consent: false,
        data_protection_consent: false,
        user_consent: false,
        status_text: "",
        search_status: false,
        from_message: false,
      });

      /*setSearchUserObject({
        ...searchUserObject,
        id: 0,
        name: "",
        text: "",
        picture: "",
        status: false,
      });*/
    };
  }, []);

  async function loadUserPosts() {
    const { data } = await supabase
      .from("posts")
      .select(
        "id, user_id, text, time_stamp, medium, public_user: user_id (id, user_id, profil_name, profil_picture)",
      )
      .eq("user_id", publicUserObject.user_id);

    if (data) {
      const sortedPosts = data.sort((a, b) => b.id - a.id);
      setPostsArray(sortedPosts);
    }
  }

  function openPostKebabMenu(postId: number) {
    if (postId) {
      if (postId === prevPostKebabMenuId) {
        setPostKebabMenuId(0);
        setPrevPostKebabMenuId(0);
      } else {
        setPostKebabMenuId(postId);
        setPrevPostKebabMenuId(postId);
      }
    }
  }

  function openEditPostPopUp(postId: number) {
    setPostKebabMenuId(0);
    setPrevPostKebabMenuId(0);

    const findPost = postsArray.find((post) => post.id === postId);

    if (findPost) {
      if (findPost.text !== "") {
        setUpdatePost(findPost.text);
      }

      setCurrentPostId(findPost.id);
      setUpdatePostPopUp(true);
    }
  }

  function editUpdateAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      console.log(file);

      if (file.size < TEN_MB) {
        console.log(
          String(file.size).slice(0, 1) + "." + String(file.size).slice(1, 3),
        );
        setAvatarFileMBSize(String(file.size));
        /*setAvatarFileMBMessage(
          `${mediumCategoryArray[1].text.slice(0, 25)} ${
            String(file.size).slice(0, 1) + "." + String(file.size).slice(1, 3)
          } ${mediumCategoryArray[1].text.slice(25, 50)}`,
        );*/
        setAvatarFileMBMessage(mediumCategoryArray[1].text(file.size));
        setMediumCategory(1);
      }

      if (file.size > TEN_MB && file.size < THIRTY_FIVE_MB) {
        console.log(
          String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3),
        );
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[2].text(file.size));
        setMediumCategory(2);
      }

      if (file.size > THIRTY_FIVE_MB && file.size < FOURTY_MB) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[3].text(file.size));
        setMediumCategory(3);
      }

      if (file.size > FOURTY_MB) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(mediumCategoryArray[4].text(file.size));
        setMediumCategory(4);
      }

      setUpdateAvatarFile(file);
    }
  }

  async function editPost(postId: number) {
    let resultIllegalContent = 0;

    for (let index = 0; index < IllegalWordsArray.length; index++) {
      resultIllegalContent = updatePost.search(IllegalWordsArray[index]);

      if (resultIllegalContent !== -1) {
        break;
      }
    }

    if (resultIllegalContent !== -1) {
      //setNoSupportContentPopUp(true);
      setInlineModerationNote(true);
    } else {
      const findPost = postsArray.find((post) => {
        return post.id === postId;
      });

      if (updateAvatarFile) {
        if (findPost) {
          const {} = await supabase.storage
            .from("medium")
            .remove([findPost.medium]);
        }

        const updateTimestamp = new Date().getTime();
        let newRandomFileName = generateRandomFileName();
        const dotPosition = updateAvatarFile.name.search(/\./);

        newRandomFileName =
          newRandomFileName +
          updateAvatarFile.name.slice(
            dotPosition,
            updateAvatarFile.name.length,
          );

        const { data } = await supabase.storage
          .from("medium")
          .upload(`all/${newRandomFileName}`, updateAvatarFile, {
            cacheControl: "3600",
            upsert: false,
          });

        const {} = await supabase
          .from("posts")
          .update({
            text: updatePost,
            time_stamp: String(updateTimestamp),
            medium: data?.path,
          })
          .eq("id", postId);

        setAvatarFileNameMessage("");
        setAvatarFileMBSize("");
        setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
        setMediumCategory(0);
        setUpdateAvatarFile(null);
        setUpdatePost("");
        loadUserPosts();
        setUpdatePostPopUp(false);
      } else {
        const updateTimestamp = new Date().getTime();

        const {} = await supabase
          .from("posts")
          .update({
            text: updatePost,
            time_stamp: String(updateTimestamp),
          })
          .eq("id", postId);

        setUpdatePost("");
        loadUserPosts();
        setUpdatePostPopUp(false);
      }

      toast.success("Dein Beitrag wurde Erfolgreich bearbeitet.", {
        unstyled: true,
        className: "w-[27rem] h-[5rem] px-5",
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

  function resetAvatarFile() {
    if (resetInputFile.current) {
      resetInputFile.current.value = "";
    }

    setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
    setMediumCategory(0);
    setAvatarFileMBSize("");
    setAvatarFileMBMessage("");
    setUpdateAvatarFile(null);
  }

  function openDeletePostPopUp(id: number) {
    setPostKebabMenuId(0);
    setPrevPostKebabMenuId(0);
    const findPost = postsArray.find((post) => post.id === id);

    if (findPost) {
      setCurrentPostId(findPost.id);
      setDeletePostPopUp(true);
    }
  }

  async function deletePost(postId: number) {
    const findPost = postsArray.find((post) => {
      return post.id === postId;
    });

    if (findPost) {
      const {} = await supabase.storage
        .from("medium")
        .remove([findPost.medium]);
    }

    const {} = await supabase.from("posts").delete().eq("id", postId);
    const {} = await supabase.from("comments").delete().eq("post_id", postId);

    toast.success("Dein Beitrag wurde Erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[24rem] h-[7rem] px-5",
    });

    loadUserPosts();
    setDeletePostPopUp(false);
  }

  async function loadFollowData() {
    const { data } = await supabase
      .from("follow")
      .select()
      .eq("userId", publicUserObject.user_id);

    if (data) {
      setFollowId(data[0].id);
      setFollow(data[0].follow);
    }
  }

  async function checkFollow(id: number, follow: boolean) {
    const currentTimestamp = new Date().toLocaleString();

    if (id) {
      const {} = await supabase
        .from("follow")
        .update({
          follow: follow,
        })
        .eq("id", id);
    } else {
      const {} = await supabase.from("follow").insert({
        userId: publicUserObject.user_id,
        follow: true,
        followTimestamp: currentTimestamp,
        followUserId: globalSearchUserObject.user_id,
        followRequest: null,
        followRequestTimestamp: "",
        is_seen: false,
      });
    }

    loadFollowData();
  }

  /*function toOverview() {
    if (searchUserObject.fromMessage) {
      setSearchUserObject({
        ...searchUserObject,
        id: 0,
        userId: "",
        profilName: "",
        profilPicture: "",
        statusText: "",
        searchStatus: false,
        fromMessage: false,
      });
      navigation("/private-route/message");
    } else {
      setSearchUserObject({
        ...searchUserObject,
        id: 0,
        userId: "",
        profilName: "",
        profilPicture: "",
        statusText: "",
        searchStatus: false,
        fromMessage: false,
      });
      navigation("/private-route/overview");
    }
  }*/

  return (
    <section className="user-section w-full h-screen">
      <Dialog open={updatePostPopUp} onOpenChange={setUpdatePostPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="update-post-popup !max-w-xl"
        >
          <DialogDescription className="update-post-popup-description p-3">
            <textarea
              value={updatePost}
              onChange={(event) => {
                setUpdatePost(event.target.value.trimStart());
              }}
              onFocus={() => {
                setInlineModerationNote(false);
              }}
              className="update-post-popup-textarea w-full h-[250px] text-black text-lg px-5 py-3 border border-gray-400 overflow-y-scroll resize-none"
              name=""
            ></textarea>

            {inlineModerationNote && (
              <div className="my-3 text-red-500 text-base">
                {" "}
                <p className="text-red-500 text-lg"> Achtung</p> In deinem
                Beitrag wurde problematischer Inhalt gefunden, bitte überprüfe
                deine Eingabe und korrigiere sie gegebenenfalls.
              </div>
            )}

            <div className="update-post-popup-input-button-div flex justify-center items-center gap-x-1.5">
              <input
                type="file"
                onChange={editUpdateAvatarFile}
                ref={resetInputFile}
                className="create-post-popup-input-file w-full bg-white text-base text-gray-700
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
                disabled={updateAvatarFile !== null ? false : true}
                className={`update-post-popup-reset-input-button px-5 py-[6px] text-base flex justify-center items-center gap-x-1 rounded-sm ${updateAvatarFile !== null ? "bg-red-600 border text-white border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600" : "bg-gray-200 border border-gray-300"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="update-post-remove-avatar-file-button w-6"
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
              className={`update-post-popup-mb-message px-3 py-1.5 text-base flex justify-start items-center border border-gray-100 rounded-sm ${mediumCategoryArray[mediumCategory].design}
                `}
            >
              {avatarFileMBMessage} {mediumCategoryArray[mediumCategory].svg}
            </div>

            <div className="update-post-popup-button-div mt-5 flex justify-end items-center gap-x-3">
              <button
                onClick={() => {
                  setUpdatePost("");
                  setCurrentPostId(0);
                  setUpdateAvatarFile(null);
                  setAvatarFileMBSize("");
                  setAvatarFileMBMessage(mediumCategoryArray[0].text(0));
                  setMediumCategory(0);
                  setAvatarFileNameMessage("");
                  setUpdatePostPopUp(false);
                  if (resetInputFile.current) {
                    resetInputFile.current.value = "";
                  }
                  setInlineModerationNote(false);
                }}
                className="update-post-popup-close-button px-5 py-1.5 text-[16px] text-black flex justify-center items-center bg-gray-200 border border-gray-300 rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="update-post-popup-close-icon w-6"
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
                onClick={() => {
                  editPost(currentPostId);
                }}
                disabled={
                  !(
                    (updatePost.length > 0 &&
                      Number(avatarFileMBSize) < FOURTY_MB) ||
                    (updateAvatarFile !== null &&
                      Number(avatarFileMBSize) < FOURTY_MB)
                  )
                }
                className={`update-post-popup-update-button px-5 py-1.5 text-[17px] flex justify-center items-center gap-x-1 rounded-sm ${
                  (updatePost.length > 0 &&
                    Number(avatarFileMBSize) < FOURTY_MB) ||
                  (updateAvatarFile !== null &&
                    Number(avatarFileMBSize) < FOURTY_MB)
                    ? "bg-blue-500 border text-white border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500"
                    : "bg-gray-200 border border-gray-300"
                } `}
              >
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="update-post-popup-edit-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="update-post-popup-paper-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>{" "}
                Beitrag bearbeiten
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={deletePostPopUp} onOpenChange={setDeletePostPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="delete-post-popup !max-w-xl"
        >
          <DialogDescription className="delete-post-popup-description p-3 text-[20px] text-black flex flex-col items-start justify-center gap-y-10">
            Willst du den Beitrag wirklich löschen?
            <div className="delete-post-popup-button-div w-full flex justify-end items-center gap-x-7">
              <button
                onClick={() => {
                  setCurrentPostId(0);
                  setDeletePostPopUp(false);
                }}
                className="delete-post-popup-close-button px-3 py-1.5 text-[16px] flex justify-center items-center bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
              >
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                <span>abbrechen</span>
              </button>{" "}
              <button
                onClick={() => {
                  deletePost(currentPostId);
                }}
                className="delete-post-popup-delete-button px-5 py-1.5 text-[16px] flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
              >
                {" "}
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                Beitrag löschen
              </button>
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
            "user-toasty flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Nav />

      {globalSearchUserObject.search_status &&
      globalSearchUserObject.status_text ===
        "" ? null : globalSearchUserObject.search_status &&
        globalSearchUserObject.status_text !== "" ? (
        <div className="user-status-text-div w-[25rem] h-[5rem] mx-auto my-3 px-3 py-2 text-lg text-gray-500 overflow-auto bg-white border border-gray-300 rounded-sm">
          {globalSearchUserObject.status_text}
        </div>
      ) : publicUserObject.status_text.length > 0 ? (
        <div className="user-status-text-div w-[25rem] h-[5rem] mx-auto my-3 px-3 py-2 text-lg text-gray-500 overflow-auto bg-white border border-gray-300 rounded-sm">
          {publicUserObject.status_text}
        </div>
      ) : null}

      <Follow followers={followers} following={following} />

      {globalSearchUserObject.search_status ? (
        <button
          onClick={() => {
            checkFollow(followId, !follow);
          }}
          className="follow-button mx-auto my-7 px-7 py-3 text-lg flex justify-center items-center gap-x-3 bg-blue-500 text-white border border-white rounded-sm transition-all duration-500 ease-in-out cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-500"
        >
          {follow ? "Gefolgt" : "Folgen"}
        </button>
      ) : null}

      <div className="user-post-overview-div w-[50%] mx-auto">
        <div
          className={`user-post-overview ${
            globalSearchUserObject.search_status === true &&
            globalSearchUserObject.status_text !== ""
              ? "h-150"
              : globalSearchUserObject.search_status === true &&
                  globalSearchUserObject.status_text === ""
                ? "h-170"
                : publicUserObject.status_text !== ""
                  ? "h-170"
                  : "h-193"
          }  mt-3 px-0.5 py-0.5 rounded-sm overflow-hidden`}
        >
          <div className="w-full h-full px-1 flex flex-col gap-y-0.5 overflow-y-scroll rounded-sm">
            {postsArray.map((post) => {
              return (
                <>
                  <Post
                    post={post}
                    openEditPostPopUp={openEditPostPopUp}
                    openDeletePostPopUp={openDeletePostPopUp}
                    hiddenPostOptions={hiddenPostOptions}
                    postKebabMenuId={postKebabMenuId}
                    openPostKebabMenu={openPostKebabMenu}
                  />
                </>
              );
            })}{" "}
          </div>
        </div>
      </div>
    </section>
  );
  /*   
  <Dialog
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
            <p className="no-suppot-content-popup-text text-xl">
              In deinem Beitrag wurde problematischer Inhalt gefunden, bitte
              überprüfe deine Eingabe und korrigiere sie gegebenenfalls.
            </p>
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
 

  id={searchUserObject.id}
        name={searchUserObject.name}
        text={searchUserObject.text}
        picture={searchUserObject.picture}
        status={searchUserObject.status}
                  
  <button
            onClick={() => {
              setUserCreatePostPopUp(true);
            }}
            className="user-new-post-button mx-auto mt-3 px-7 py-3 text-[17px] flex justify-center items-center gap-x-3 transition-all duration-500 ease-in-out bg-blue-500 text-white border border-blue-500 rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="user-new-post-plus-icon w-6"
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
                className="user-new-post-paper-icon w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <span className="user-new-button-label interaction-label text-lg">
              Beitrag erstellen
            </span>
          </button>
          
          <Dialog open={noticePopUp} onOpenChange={setNoticePopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="!max-w-xl"
        >
          <DialogHeader>
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
