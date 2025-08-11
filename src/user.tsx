import { Link, useNavigate, useParams } from "react-router-dom";
import "./user.css";
import { useEffect, useContext, useState, useRef } from "react";
import { publicUserContext } from "./publicUserContext";
import { supabase } from "./supabase";
import type { Tables } from "./database.types";
import Post from "./component/post";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription } from "./components/ui/dialog";
import { IllegalWordsArray } from "./illegalWords";
import { serachUserContext } from "./searchUserContext";
import Follow from "./component/follow";
import { postsContext } from "./postContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { alphabeta_zA_ZArray } from "./alphabet";
import "./responsive.css";

export default function User() {
  const TEN_MB: number = 10 * 1000 * 1000;
  const THIRTY_FIVE_MB: number = 35 * 1000 * 1000;
  const FORTY_MB: number = 40 * 1000 * 1000;
  const [, setCommentsArray] = useState<Tables<"comments">[]>([]);
  const [hiddenPostOptions] = useState<string>("");
  const [createPost, setCreatePost] = useState<string>("");
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [createPostPopUp, setCreatePostPopUp] = useState<boolean>(false);
  //const [noticePostPopUp, setNoticePostPopUp] = useState<boolean>(false);
  const [updatePost, setUpdatePost] = useState<string>("");
  const [updateAvatarFile, setUpdateAvatarFile] = useState<File | null>(null);
  const [, setAvatarFileNameMessage] = useState<string>("");
  const [avatarFileMBMessage, setAvatarFileMBMessage] = useState<string>("");
  const [avatarFileMBSize, setAvatarFileMBSize] = useState<string>("");
  //const [avatarFileMessage, setAvatarFileMessage] = useState<string>("");
  const [checkTextContent, setCheckTextContent] = useState<boolean>(false);
  const [checkMediumContent, setCheckMediumContent] = useState<boolean>(false);
  const [updatePostPopUp, setUpdatePostPopUp] = useState<boolean>(false);
  /*const [noticeUpdatePostPopUp, setNoticeUpdatePostPopUp] =
    useState<boolean>(false);*/
  const [currentPostId, setCurrentPostId] = useState<number>(0);
  const [postKebabMenuId, setPostKebabMenuId] = useState<number>(0);
  const [prevPostKebabMenuId, setPrevPostKebabMenuId] = useState<number>(0);
  const [deletePostPopUp, setDeletePostPopUp] = useState<boolean>(false);
  const [noSupportContentPopUp, setNoSupportContentPopUp] =
    useState<boolean>(false);
  const [, setNoSupportContentMessage] = useState<string>("");
  //const [noticeMessage, setNoticeMessage] = useState<string>("");
  //const [noticePopUp, setNoticePopUp] = useState<boolean>(false);
  const [follow, setFollow] = useState<boolean | null>(false);
  const [followId, setFollowId] = useState<number>(0);
  const [currentFollow, setCurrentFollow] = useState<number>(0);
  const [currentFollowed, setCurrentFollowed] = useState<number>(0);
  //const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);
  const { publicUserObject } = useContext(publicUserContext);
  const { postsArray, setPostsArray } = useContext(postsContext);
  const { searchUserObject, setSearchUserObject } =
    useContext(serachUserContext);
  const navigation = useNavigate();
  const { userId } = useParams();
  const resetInputFile = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      console.log(userId);

      if (userId !== publicUserObject.userId) {
        const { data } = await supabase
          .from("public-user")
          .select()
          .eq("userId", userId!);

        if (data) {
          const searchUserData = data[0];

          setSearchUserObject({
            ...searchUserObject,
            userId: searchUserData.userId,
            Profilname: searchUserData.Profilname,
            profilPicture: searchUserData.profilPicture,
            Statustext: searchUserData.Statustext,
          });
        }
      }

      const { data: posts } = await supabase
        .from("posts")
        .select(
          "id, userId, text, timestamp, medium, public_user: userId (id, userId, Profilname, profilPicture)"
        )
        .eq("userId", userId!);

      const { data: comments } = await supabase.from("comments").select();

      if (searchUserObject.userId !== "") {
        const { data: userFollowOptions } = await supabase
          .from("follow")
          .select()
          .eq("userId", publicUserObject.userId)
          .eq("follow", true)
          .eq("FollowUserId", searchUserObject.userId);

        if (userFollowOptions && userFollowOptions.length > 0) {
          setFollowId(userFollowOptions[0].id);
          setFollow(userFollowOptions[0].follow);
        }
      }

      const { count: currentFollowCount } = await supabase
        .from("follow")
        .select("*", { count: "exact", head: true })
        .eq("FollowUserId", userId!)
        .eq("follow", true);

      console.log(currentFollowCount);

      const { count: currentFollowed } = await supabase
        .from("follow")
        .select("*", { count: "exact", head: true })
        .eq("userId", userId!)
        .eq("follow", true);

      if (posts && posts.length > 0) {
        const sortedPosts = posts.sort((a, b) => b.id - a.id);
        setPostsArray(sortedPosts);
      }

      if (comments) {
        const sortedCommenst = comments.sort((a, b) => b.id - a.id);
        setCommentsArray(sortedCommenst);
      }

      if (currentFollowCount) {
        setCurrentFollow(currentFollowCount);
      } else {
        setCurrentFollow(0);
      }

      if (currentFollowed) {
        setCurrentFollowed(currentFollowed);
      } else {
        setCurrentFollowed(0);
      }
    };

    fetchAllData();
  }, []);

  async function loadUserPosts() {
    const { data } = await supabase
      .from("posts")
      .select(
        "id, userId, text, timestamp, medium, public_user: userId (id, userId, Profilname, profilPicture)"
      )
      .eq("userId", publicUserObject.userId);

    if (data) {
      const sortedPosts = data.sort((a, b) => b.id - a.id);
      setPostsArray(sortedPosts);
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

      if (file.size > THIRTY_FIVE_MB && file.size < FORTY_MB) {
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

      if (file.size > FORTY_MB) {
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
        setNoSupportContentPopUp(true);
      } else {
        if (newAvatarFile) {
          const currentTimestamp = new Date().toLocaleString();
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
          setAvatarFileMBMessage("");
          setAvatarFileMBSize("");
          setCheckTextContent(false);
          setCheckMediumContent(false);
          setNewAvatarFile(null);
          setCreatePost("");
          loadUserPosts();
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
            className: "w-[20rem] h-[6rem] px-5",
          });

          setCheckTextContent(false);
          setCheckMediumContent(false);
          setCreatePost("");
          loadUserPosts();
          setCreatePostPopUp(false);
        }
      }
    } else {
      console.log(newAvatarFile);

      if (newAvatarFile) {
        const currentTimestamp = new Date().toLocaleString();
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
        setCreatePostPopUp(false);
        loadUserPosts();
      }
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
        setCheckTextContent(true);
      }

      setCurrentPostId(findPost.id);
      setUpdatePostPopUp(true);
    }
  }

  function editUpdatePostInput(updatePostInput: string) {
    const updatePostWithoutSpace = updatePostInput;
    setUpdatePost(updatePostWithoutSpace.trimStart());

    if (updatePostWithoutSpace.trimStart().length > 0) {
      setCheckTextContent(true);
    }

    if (updatePostWithoutSpace === "" || Number(avatarFileMBSize) > FORTY_MB) {
      setCheckTextContent(false);
    }
  }

  function editUpdateAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      console.log(file);

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
        setUpdateAvatarFile(file);
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
        setUpdateAvatarFile(file);
      }

      if (file.size > THIRTY_FIVE_MB && file.size < FORTY_MB) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
          } MB groß und liegt innerhalb des erlaubten Limits. Das Hochladen kann einen Moment dauern.`
        );
        setCheckTextContent(true);
        setCheckMediumContent(true);
        setUpdateAvatarFile(file);
      }

      if (file.size > FORTY_MB) {
        console.log(String(file.size));
        setAvatarFileMBSize(String(file.size));
        setAvatarFileMBMessage(
          `Die ausgewählte Datei ist ${
            String(file.size).slice(0, 2) + "." + String(file.size).slice(2, 3)
          } MB groß und überschreitet das Limit von 40 MB.`
        );
        setCheckTextContent(false);
        setCheckMediumContent(false);
        setUpdateAvatarFile(null);
      }
    }
  }

  async function editPost(postId: number) {
    if (updatePost !== "") {
      let resultIllegalContent = 0;

      for (let index = 0; index < IllegalWordsArray.length; index++) {
        resultIllegalContent = updatePost.search(IllegalWordsArray[index]);

        if (resultIllegalContent !== -1) {
          break;
        }
      }

      if (resultIllegalContent !== -1) {
        setNoSupportContentPopUp(true);
      } else {
        const findPost = postsArray.find((post) => {
          return post.id === postId;
        });

        if (findPost) {
          const {} = await supabase.storage
            .from("medium")
            .remove([findPost.medium]);
        }

        if (updateAvatarFile) {
          const updateTimestamp = new Date().toLocaleString();
          let mediumUrl = null;
          let newRandomFileName = generateRandomFileName();
          const dotPosition = updateAvatarFile.name.search(/\./);

          newRandomFileName =
            newRandomFileName +
            updateAvatarFile.name.slice(
              dotPosition,
              updateAvatarFile.name.length
            );

          const { data } = await supabase.storage
            .from("medium")
            .upload(`all/${newRandomFileName}`, updateAvatarFile, {
              cacheControl: "3600",
              upsert: false,
            });

          mediumUrl = data;

          const {} = await supabase
            .from("posts")
            .update({
              text: updatePost,
              timestamp: updateTimestamp,
              medium: mediumUrl?.path,
            })
            .eq("id", postId);

          toast.success("Dein Beitrag wurde Erfolgreich bearbeitet.", {
            unstyled: true,
            className: "w-[27rem] h-[5rem] px-5",
          });

          setAvatarFileNameMessage("");
          setAvatarFileMBSize("");
          setAvatarFileMBMessage("");
          setUpdateAvatarFile(null);
          setCheckTextContent(false);
          setCheckMediumContent(false);
          setUpdatePost("");
          loadUserPosts();
          setUpdatePostPopUp(false);
        } else {
          const updateTimestamp = new Date().toLocaleString();

          const {} = await supabase
            .from("posts")
            .update({
              text: updatePost,
              timestamp: updateTimestamp,
            })
            .eq("id", postId);

          toast.success("Dein Beitrag wurde Erfolgreich bearbeitet.", {
            unstyled: true,
            className: "w-[27rem] h-[5rem] px-5",
          });

          setCheckTextContent(false);
          setCheckMediumContent(false);
          setUpdatePost("");
          loadUserPosts();
          setUpdatePostPopUp(false);
        }
      }
    } else {
      const findPost = postsArray.find((post) => {
        return post.id === postId;
      });

      if (findPost) {
        const {} = await supabase.storage
          .from("medium")
          .remove([findPost.medium]);
      }

      if (updateAvatarFile) {
        const updateTimestamp = new Date().toLocaleString();
        let mediumUrl = null;
        let newRandomFileName = generateRandomFileName();
        const dotPosition = updateAvatarFile.name.search(/\./);

        newRandomFileName =
          newRandomFileName +
          updateAvatarFile.name.slice(
            dotPosition,
            updateAvatarFile.name.length
          );

        const { data } = await supabase.storage
          .from("medium")
          .upload(`all/${newRandomFileName}`, updateAvatarFile, {
            cacheControl: "3600",
            upsert: false,
          });

        mediumUrl = data;

        const {} = await supabase
          .from("posts")
          .update({
            timestamp: updateTimestamp,
            medium: mediumUrl?.path,
          })
          .eq("id", postId);

        toast.success("Dein Beitrag wurde Erfolgreich bearbeitet.", {
          unstyled: true,
          className: "w-[27rem] h-[5rem] px-5",
        });

        setAvatarFileNameMessage("");
        setAvatarFileMBSize("");
        setAvatarFileMBMessage("");
        setUpdateAvatarFile(null);
        setCheckTextContent(false);
        setCheckMediumContent(false);
        setUpdatePost("");
        loadUserPosts();
        setUpdatePostPopUp(false);
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

  function resetAvatarFile(postState: string) {
    if (resetInputFile.current) {
      resetInputFile.current.value = "";
    }

    if (postState === "create") {
      if (createPost !== "") {
        setCheckTextContent(true);
      } else {
        setCheckTextContent(false);
      }
    } else {
      if (updatePost !== "") {
        setCheckTextContent(true);
      } else {
        setCheckTextContent(false);
      }
    }

    setAvatarFileNameMessage("");
    setAvatarFileMBSize("");
    setAvatarFileMBMessage("");
    setCheckMediumContent(false);
    setNewAvatarFile(null);
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
    const {} = await supabase.from("comments").delete().eq("postId", postId);

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
      .eq("userId", publicUserObject.userId);

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
        userId: publicUserObject.userId,
        follow: follow,
        followTimestamp: currentTimestamp,
        FollowUserId: searchUserObject.userId,
      });
    }

    loadFollowData();
  }

  function toOverview() {
    if (searchUserObject.fromMessage) {
      setSearchUserObject({
        ...searchUserObject,
        id: 0,
        userId: "",
        Profilname: "",
        profilPicture: "",
        Statustext: "",
        searchStatus: false,
        fromMessage: false,
      });
      navigation("/private-route/message");
    } else {
      setSearchUserObject({
        ...searchUserObject,
        id: 0,
        userId: "",
        Profilname: "",
        profilPicture: "",
        Statustext: "",
        searchStatus: false,
        fromMessage: false,
      });
      navigation("/private-route/overview");
    }
  }

  return (
    <section className="user-section w-full">
      <Dialog open={createPostPopUp} onOpenChange={setCreatePostPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="create-post-popup !max-w-xl"
        >
          <DialogDescription className="create-post-popup-description p-x-3 pt-3 pb-1">
            <textarea
              value={createPost}
              onChange={(event) => {
                editCreatePostInput(event.target.value);
              }}
              className="create-post-popup-textarea w-full h-[250px] text-black text-lg px-5 py-3 border border-gray-400 overflow-y-scroll resize-none"
              name=""
            ></textarea>
            <div className="create-post-popup-input-button-div flex justify-center items-center">
              <input
                type="file"
                onChange={editNewAvatarFile}
                ref={resetInputFile}
                className="create-post-popup-input-file w-full bg-white text-base text-gray-700
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
                onClick={() => {
                  resetAvatarFile("create");
                }}
                className="create-post-popup-reset-input-button px-5 py-[7px] text-base flex justify-center items-center gap-x-1 rounded-sm bg-blue-400 border text-white border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
              >
                <span>❌</span>Entfernen
              </button>
            </div>
            <div
              className={`create-post-popup-mb-message px-3 py-1.5 text-base flex justify-start items-center border border-gray-100 rounded-sm ${
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
            <div className="create-post-popup-button-div mt-5 flex justify-end items-center gap-x-5">
              <button
                onClick={() => {
                  setCreatePost("");
                  setAvatarFileMBSize("");
                  setAvatarFileMBMessage("");
                  setAvatarFileNameMessage("");
                  setCheckTextContent(false);
                  setCheckMediumContent(false);
                  setCreatePostPopUp(false);
                }}
                className="create-post-popup-close-button px-3 py-1.5 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
                disabled={!(checkTextContent || checkMediumContent)}
                className={`create-post-popup-create-button px-5 py-1.5 text-[17px] flex justify-center items-center gap-x-1 rounded-sm ${
                  checkTextContent === true || checkMediumContent === true
                    ? "bg-blue-400 border text-white border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                    : "bg-gray-200"
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
          </DialogDescription>
        </DialogContent>
      </Dialog>

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
                editUpdatePostInput(event.target.value);
              }}
              className="update-post-popup-textarea w-full h-[250px] text-black text-lg px-5 py-3 border border-gray-400 overflow-y-scroll resize-none"
              name=""
            ></textarea>

            <div className="update-post-popup-input-button-div flex justify-center items-center">
              <input
                type="file"
                onChange={editUpdateAvatarFile}
                ref={resetInputFile}
                className="update-post-popup-input-file w-full bg-white text-base text-gray-700
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
                onClick={() => {
                  resetAvatarFile("update");
                }}
                className="update-post-popup-reset-input-button px-5 py-[7px] text-base flex justify-center items-center gap-x-1 rounded-sm bg-blue-400 border text-white border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
              >
                <span>❌</span>Entfernen
              </button>
            </div>

            <div
              className={`update-post-popup-mb-message px-3 py-1.5 text-base flex justify-start items-center border border-gray-100 rounded-sm ${
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

            <div className="update-post-popup-button-div mt-5 flex justify-end items-center gap-x-3">
              <button
                onClick={() => {
                  setUpdatePost("");
                  setCurrentPostId(0);
                  setAvatarFileMBSize("");
                  setAvatarFileMBMessage("");
                  setAvatarFileNameMessage("");
                  setCheckTextContent(false);
                  setCheckMediumContent(false);
                  setUpdatePostPopUp(false);
                }}
                className="update-post-popup-close-button px-5 py-1.5 text-[16px] text-black flex justify-center items-center bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
                disabled={!(checkTextContent || checkMediumContent)}
                className={`update-post-popup-update-button px-5 py-1.5 text-[17px] flex justify-center items-center gap-x-1 rounded-sm ${
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

      <nav className="user-nav-bar w-full mb-10 px-20 py-5 bg-white flex justify-around items-center">
        <button
          onClick={toOverview}
          className="to-overview-link cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="back-arrow-icon w-13"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <h1 className="user-headline text-4xl flex justify-center items-center gap-x-5">
          <div className="user-headline-div flex justify-center items-center gap-x-3">
            User{" "}
            {userId === searchUserObject.userId ? (
              <img
                src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${searchUserObject.profilPicture}`}
                className="search-user-picture w-20 h-20 bg-cover rounded-full"
                alt=""
              />
            ) : userId === publicUserObject.userId ? (
              <img
                src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${publicUserObject.profilPicture}`}
                className="public-user-picture w-20 h-20 bg-cover rounded-full"
                alt=""
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="user-placeholder-icon w-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            )}{" "}
          </div>
          <span className="user-name">
            {userId === publicUserObject.userId
              ? publicUserObject.Profilname
              : searchUserObject.Profilname}
          </span>
        </h1>

        {userId === publicUserObject.userId ? (
          <Link
            to="/private-route/settings"
            className="to-settings-link cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="to-settings-icon w-13"
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
          </Link>
        ) : (
          <div className="user-placeholder w-13"></div>
        )}
      </nav>

      {publicUserObject.Statustext !== "" ? (
        <div className="user-status-text-div w-[50rem] h-[10rem] mx-auto px-3 py-2 text-lg border border-gray-300 rounded-sm">
          {publicUserObject.Statustext}
        </div>
      ) : null}

      <Follow currentFollow={currentFollow} currentFollowed={currentFollowed} />

      <div className="user-post-overview-div w-[50%] mx-auto mt-10">
        {userId === publicUserObject.userId ? (
          <button
            onClick={() => {
              setCreatePostPopUp(true);
            }}
            className="user-new-post-button mx-auto mt-3 px-5 py-3 text-[17px] flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-blue-400 rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="user-new-post-plus-icon w-7"
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
                className="user-new-post-paper-icon w-7"
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
        ) : (
          <button
            onClick={() => {
              checkFollow(followId, !follow);
            }}
            className="follow-button mx-auto mt-3 px-7 py-3 text-lg flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
          >
            {follow ? "Gefolgt" : "Folgen"}
          </button>
        )}

        <div
          className={`user-post-overview ${
            publicUserObject.Statustext === "" ? "h-153" : "h-110"
          } mt-3 px-5 bg-gray-100 rounded-sm overflow-y-scroll`}
        >
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
          })}
        </div>
      </div>
    </section>
  );
  /* <Dialog open={noticePopUp} onOpenChange={setNoticePopUp}>
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
