import { useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase";
import Comment from "./comment";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { publicUserContext } from "@/publicUserContext";
import { IllegalWordsArray } from "@/illegalWords";
import { serachUserContext } from "@/searchUserContext";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { PostObject } from "@/postContext";
import type { PublicUserObject } from "@/postContext";
//import "../responsive.css";

export interface CommentObject {
  comment: string;
  id: number;
  postId: number;
  public_user: PublicUserObject;
  timestamp: string;
  userId: string;
}

export default function Post({
  post,
  openEditPostPopUp,
  openDeletePostPopUp,
  hiddenPostOptions,
  postKebabMenuId,
  openPostKebabMenu,
}: {
  post: PostObject;
  openEditPostPopUp: (postId: number) => void;
  openDeletePostPopUp: (postId: number) => void;
  hiddenPostOptions: string;
  postKebabMenuId: number;
  openPostKebabMenu: (postId: number) => void;
}) {
  const [commentsArray, setCommentsArray] = useState<CommentObject[]>([]);
  const [createComment, setCreateComment] = useState<string>("");
  const [updateComment, setUpdateComment] = useState<string>("");
  const [checkTextContent, setCheckTextContent] = useState<boolean>(false);
  const [currentCommentId, setCurrentCommentId] = useState<number>(0);
  const [commentPopUp, setCommentPopUp] = useState<boolean>(false);
  const [createCommentPopUp, setCreateCommentPopUp] = useState<boolean>(false);
  //const [noticeCommentPopUp, setNoticeCommentPopUp] = useState<boolean>(false);
  const [updateCommentPopUp, setUpdateCommentPopUp] = useState<boolean>(false);
  /*const [noticeUpdateCommentPopUp, setNoticeUpdateCommentPopUp] =
    useState<boolean>(false);*/
  const [deleteCommentPopUp, setDeleteCommentPopUp] = useState<boolean>(false);
  const [noSupportContentPopUp, setNoSupportContentPopUp] =
    useState<boolean>(false);
  const [noSupportContentMessage, setNoSupportContentMessage] =
    useState<string>("");
  const [currentPostId, setCurrentPostId] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [likeDislikePostId, setLikeDislikePostId] = useState<number>(0);
  const [likePostCount, setLikePostCount] = useState<number>(0);
  const [dislikePostCount, setDislikePostCount] = useState<number>(0);
  const [prevLikeDislikePostType, setPrevLikeDislikePostType] =
    useState<string>("");
  const { publicUserObject } = useContext(publicUserContext);
  const { searchUserObject } = useContext(serachUserContext);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: session } = await supabase.auth.getSession();

      const { data: like_dislike_post } = await supabase
        .from("like-dislike-posts")
        .select()
        .eq("userId", session.session!.user.id)
        .eq("postId", post.id);

      const { count: like_post_count } = await supabase
        .from("like-dislike-posts")
        .select("*", { count: "exact", head: true })
        .eq("postId", post.id)
        .eq("type", "like");

      const { count: dislike_post_count } = await supabase
        .from("like-dislike-posts")
        .select("*", { count: "exact", head: true })
        .eq("postId", post.id)
        .eq("type", "dislike");

      const { data: comments } = await supabase
        .from("comments")
        .select(
          "id, userId, comment, timestamp, postId, public_user: userId (id, userId, Profilname, profilPicture)"
        );

      const { count: comment_count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("postId", post.id);

      if (like_dislike_post) {
        if (like_dislike_post[0] !== undefined) {
          setLikeDislikePostId(like_dislike_post[0].id);
          setPrevLikeDislikePostType(like_dislike_post[0].type);
        }
      }

      if (like_post_count) {
        setLikePostCount(like_post_count);
      } else {
        setLikePostCount(0);
      }

      if (dislike_post_count) {
        setDislikePostCount(dislike_post_count);
      } else {
        setDislikePostCount(0);
      }

      if (comments) {
        const sortedCommenst = comments.sort((a, b) => b.id - a.id);
        setCommentsArray(sortedCommenst);
      }

      if (comment_count) {
        setCommentCount(comment_count);
      } else {
        setCommentCount(0);
      }
    };

    fetchAllData();
  }, []);

  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select(
        "id, userId, comment, timestamp, postId, public_user: userId (id, userId, Profilname, profilPicture)"
      );

    if (data) {
      const sortedComments = data.sort((a, b) => b.id - a.id);
      setCommentsArray(sortedComments);
    }
  }

  async function loadCommentCounts() {
    const { count: comment_count } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("postId", post.id);

    if (comment_count) {
      setCommentCount(comment_count);
    } else {
      setCommentCount(0);
    }
  }

  async function checkLikeDislikePost(
    id: number,
    postId: number,
    userId: string,
    currentLikeDislike: string,
    prevLikeDislike: string
  ) {
    if (currentLikeDislike === prevLikeDislike) {
      const {} = await supabase
        .from("like-dislike-posts")
        .delete()
        .eq("id", id);

      setLikeDislikePostId(0);
      setPrevLikeDislikePostType("");
      loadLikeDislikePostCount(postId);
    }
    if (currentLikeDislike !== prevLikeDislike) {
      const {} = await supabase
        .from("like-dislike-posts")
        .delete()
        .eq("id", id);

      const currentTimestamp = new Date().toLocaleString();

      const {} = await supabase.from("like-dislike-posts").insert({
        userId: userId,
        type: currentLikeDislike,
        timestampe: currentTimestamp,
        postId: postId,
      });

      loadLikeDislikePost(postId);
      loadLikeDislikePostCount(postId);
    }
  }

  async function loadLikeDislikePost(postId: number) {
    const { data: session } = await supabase.auth.getSession();

    const { data: like_dislike_post } = await supabase
      .from("like-dislike-posts")
      .select()
      .eq("userId", session.session!.user.id)
      .eq("postId", postId);

    if (like_dislike_post) {
      if (like_dislike_post[0] !== undefined) {
        setLikeDislikePostId(like_dislike_post[0].id);
        setPrevLikeDislikePostType(like_dislike_post[0].type);
      }
    }
  }

  async function loadLikeDislikePostCount(postId: number) {
    const { count: like_post_count } = await supabase
      .from("like-dislike-posts")
      .select("*", { count: "exact", head: true })
      .eq("postId", postId)
      .eq("type", "like");

    const { count: dislike_post_count } = await supabase
      .from("like-dislike-posts")
      .select("*", { count: "exact", head: true })
      .eq("postId", postId)
      .eq("type", "dislike");

    if (like_post_count) {
      setLikePostCount(like_post_count);
    } else {
      setLikePostCount(0);
    }

    if (dislike_post_count) {
      setDislikePostCount(dislike_post_count);
    } else {
      setDislikePostCount(0);
    }
  }

  function openCommentPopUp(postId: number) {
    const filteredCommentArray = commentsArray.filter((comment) => {
      return comment.postId === postId;
    });

    setCurrentPostId(postId);
    setCommentsArray(filteredCommentArray);
    setCommentPopUp(true);
  }

  function openCreateCommentPopUp() {
    setCreateCommentPopUp(true);
  }

  function editCreateCommentInput(createCommentInput: string) {
    const createCommentWithoutSpace = createCommentInput;
    setCreateComment(createCommentWithoutSpace.trimStart());

    if (createCommentWithoutSpace.trimStart().length > 0) {
      setCheckTextContent(true);
    }

    if (createCommentWithoutSpace === "") {
      setCheckTextContent(false);
    }
  }

  async function newComment() {
    if (createComment !== "") {
      let resultIllegalContent = 0;

      for (let index = 0; index < IllegalWordsArray.length; index++) {
        resultIllegalContent = createComment.search(IllegalWordsArray[index]);

        if (resultIllegalContent !== -1) {
          break;
        }
      }

      if (resultIllegalContent !== -1) {
        setNoSupportContentMessage(
          "In deinem Kommentar wurde problematischer Inhalt gefunden. Bitte überprüfe und korrigiere ihn."
        );
        setNoSupportContentPopUp(true);
      } else {
        const currentTimestamp = new Date().toLocaleString();

        const {} = await supabase.from("comments").insert({
          userId: publicUserObject.userId,
          comment: createComment,
          timestamp: currentTimestamp,
          postId: currentPostId,
        });

        toast.success("Dein Kommentar wurde Erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[20rem] h-[6rem] px-5",
        });

        loadComments();
        setCreateComment("");
        setCheckTextContent(false);
        setCreateCommentPopUp(false);
      }
    }
  }

  function openEditCommentPopUp(commentId: number) {
    const findComment = commentsArray.find(
      (comment) => comment.id === commentId
    );

    if (findComment) {
      setUpdateComment(findComment.comment);
      setCurrentCommentId(commentId);
      setCheckTextContent(true);
      setUpdateCommentPopUp(true);
    }
  }

  function editUpdateCommentInput(updateCommentInput: string) {
    const updateCommentWithoutSpace = updateCommentInput;
    setUpdateComment(updateCommentWithoutSpace.trimStart());

    if (updateCommentWithoutSpace.trimStart().length > 0) {
      setCheckTextContent(true);
    }

    if (updateCommentWithoutSpace === "") {
      setCheckTextContent(false);
    }
  }

  async function editComment(commentId: number) {
    if (updateComment !== "") {
      let resultIllegalContent = 0;

      for (let index = 0; index < IllegalWordsArray.length; index++) {
        resultIllegalContent = updateComment.search(IllegalWordsArray[index]);

        if (resultIllegalContent !== -1) {
          break;
        }
      }

      if (resultIllegalContent !== -1) {
        setNoSupportContentMessage(
          "In deinen Kommentar wurde problematischer Inhalt gefunden. Bitte überprüfe und korrigiere ihn."
        );
        setNoSupportContentPopUp(true);
      } else {
        const updateTimestamp = new Date().toLocaleString();

        const {} = await supabase
          .from("comments")
          .update({ comment: updateComment, timestamp: updateTimestamp })
          .eq("id", commentId);

        toast.success("Dein Kommentar wurde Erfolgreich bearbeitet.", {
          unstyled: true,
          className: "w-[20rem] h-[5rem] px-5",
        });

        loadComments();
        setUpdateComment("");
        setCurrentCommentId(0);
        setCheckTextContent(false);
        setUpdateCommentPopUp(false);
      }
    }
  }

  function openDeleteCommentPopUp(commentId: number) {
    const findComment = commentsArray.find(
      (comment) => comment.id === commentId
    );

    if (findComment) {
      setCurrentCommentId(findComment.id);
      setDeleteCommentPopUp(true);
    }
  }

  async function deleteComment(commentId: number) {
    const {} = await supabase.from("comments").delete().eq("id", commentId);

    toast.success("Dein Kommentar wurde Erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[20rem] h-[5rem] px-5",
    });

    setCurrentCommentId(0);
    loadComments();
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "toasty flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />

      <Dialog open={commentPopUp} onOpenChange={setCommentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="comment-overview-popup !max-w-xl"
        >
          <DialogHeader className="comment-overview-popup-header h-[800px] py-1 px-3 border border-gray-400 rounded-sm overflow-y-scroll">
            <div className="">
              {commentsArray
                .filter((comment) => comment.postId === currentPostId)
                .map((comment) => {
                  return (
                    <>
                      <Comment
                        comment={comment}
                        openEditCommentPopUp={openEditCommentPopUp}
                        openDeleteCommentPopUp={openDeleteCommentPopUp}
                      />
                    </>
                  );
                })}
            </div>
          </DialogHeader>
          <DialogDescription className="comment-overview-popup-description flex justify-end items-center gap-x-3">
            {" "}
            <button
              onClick={() => {
                loadCommentCounts();
                setCurrentPostId(0);
                setCreateComment("");
                setCommentPopUp(false);
              }}
              className="comment-overview-popup-close-button px-3 py-1.5 text-[16px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="comment-overview-popup-close-icon w-6"
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
              onClick={openCreateCommentPopUp}
              className="comment-overview-popup-open-new-comment-button px-5 py-1.5 text-[16px] flex justify-center items-center gap-x-1 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
            >
              <div className="flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="comment-overview-popup-plus-icon size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="comment-overview-popup-chat-icon w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              </div>
              Kommentar erstellen
            </button>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={createCommentPopUp} onOpenChange={setCreateCommentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="create-comment-popup !max-w-xl"
        >
          <DialogDescription className="create-comment-popup-description p-3 flex flex-col items-center justify-center gap-y-5">
            <textarea
              value={createComment}
              onChange={(event) => {
                editCreateCommentInput(event.target.value);
              }}
              className="create-comment-popup-textarea w-full h-[250px] text-black text-lg px-5 py-3 border border-gray-400 resize-none"
              name=""
            ></textarea>

            <div className="create-comment-popup-button-div w-full pt-1 flex justify-end items-center gap-x-3">
              <button
                onClick={() => {
                  loadComments();
                  setCreateComment("");
                  setCheckTextContent(false);
                  setCreateCommentPopUp(false);
                }}
                className="create-comment-popup-close-button px-3 py-1.5 text-[16px] text-black flex justify-center items-center bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="create-comment-popup-close-icon w-6 cursor-pointer"
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
                onClick={newComment}
                disabled={!checkTextContent}
                className={`create-comment-popup-new-comment-button px-5 py-1.5 text-[16px] flex justify-center items-center gap-x-1 rounded-sm ${
                  checkTextContent
                    ? "bg-blue-400 text-white border border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                    : "bg-gray-200"
                }`}
              >
                {" "}
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="create-comment-popup-plus-icon size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="create-comment-popup-chat-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                Kommentar erstellen
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={updateCommentPopUp} onOpenChange={setUpdateCommentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="update-comment-popup !max-w-xl"
        >
          <DialogDescription className="update-comment-popup-description p-3 flex flex-col items-center justify-center gap-y-5">
            <textarea
              value={updateComment}
              onChange={(event) => {
                editUpdateCommentInput(event.target.value);
              }}
              className="update-comment-popup-textarea w-full h-[250px] text-black text-lg px-5 py-3 border border-gray-400 resize-none"
              name=""
            ></textarea>

            <div className="update-comment-popup-button-div w-full flex justify-end items-center gap-x-5">
              {" "}
              <button
                onClick={() => {
                  setCurrentCommentId(0);
                  setUpdateComment("");
                  setCheckTextContent(false);
                  setUpdateCommentPopUp(false);
                }}
                className="update-comment-popup-close-button px-3 py-1.5 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="update-comment-popup-close-icon w-6"
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
                  editComment(currentCommentId);
                }}
                disabled={!checkTextContent}
                className={`update-comment-popup-update-button px-5 py-1.5 text-[16px] flex justify-center items-center gap-x-1 rounded-sm ${
                  checkTextContent
                    ? "bg-blue-400 text-white border border-white cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                    : "bg-gray-200"
                }`}
              >
                {" "}
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="update-comment-popup-update-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="update-comment-popup-chat-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>{" "}
                Kommentar bearbeiten{" "}
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
          className="post-no-support-content-popup !max-w-xl py-10"
        >
          <DialogDescription className="post-no-support-content-popup-description px-5 pt-3 pb-1 text-black">
            <p className="post-no-support-content-popup-attention text-2xl text-red-500">
              Achtung
            </p>
            <br />
            <p className="post-no-support-content-popup-text text-xl">
              {noSupportContentMessage}
            </p>
            <button
              onClick={() => {
                setNoSupportContentMessage("");
                setNoSupportContentPopUp(false);
              }}
              className="post-no-support-content-popup-close-button mx-auto mt-10 mb-3 px-5 py-1 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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

      <Dialog open={deleteCommentPopUp} onOpenChange={setDeleteCommentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="delete-comment-popup !max-w-xl py-10"
        >
          <DialogDescription className="delete-comment-popup-description p-3 text-[20px] text-black flex flex-col items-start justify-center gap-y-10">
            Willst du diesen Kommentar wirklich löschen?
          </DialogDescription>
          <DialogClose className="delete-comment-popup-close flex justify-end items-center gap-x-3">
            {" "}
            <button
              onClick={() => {
                setCurrentCommentId(0);
                setDeleteCommentPopUp(false);
              }}
              className="delete-comment-popup-close-button px-3 py-1.5 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="delete-comment-popup-close-icon w-5 cursor-pointer"
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
                deleteComment(currentCommentId);
              }}
              className="delete-comment-popup-delete-button px-5 py-1.5 flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="delete-comment-popup-delete-icon w-6 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              löschen
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <div className="post mx-3 my-10 px-10 pt-5 pb-1 bg-white shadow-lg rounded-sm">
        <div className="post-user-option-div my-3 flex justify-between items-center gap-x-3">
          <div className="post-user-div flex justify-center items-center gap-x-3">
            {publicUserObject.profilPicture !== "" ? (
              <img
                src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${post.public_user.profilPicture}`}
                className="profilpicture w-13 h-13 bg-cover rounded-full"
                alt=""
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="user-icon w-10 text-blue-400 rounded-sm hover:text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            )}
            <p className="profilname text-[18px]">
              {post.public_user.Profilname}
            </p>
          </div>

          <div className="post-option-button-div flex justify-center items-center gap-x-3">
            {postKebabMenuId === post.id ? (
              <div className="post-option-div px-3 py-3 bg-white flex flex-col items-center justify-center gap-y-1 border border-gray-200 shadow-lg rounded-sm">
                {" "}
                <button
                  onClick={() => {
                    openEditPostPopUp(post.id);
                  }}
                  className={`edit-button px-2 py-1 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400 ${
                    hiddenPostOptions === "hiddenPostOptions" ? "hidden" : ""
                  } ${searchUserObject.searchStatus ? "hidden" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    openDeletePostPopUp(post.id);
                  }}
                  className={`delete-button px-2 py-1 flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500 ${
                    hiddenPostOptions === "hiddenPostOptions" ? "hidden" : ""
                  } ${searchUserObject.searchStatus ? "hidden" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ) : null}

            <button
              onClick={() => {
                openPostKebabMenu(post.id);
              }}
              className={`post-kebab-menu-button ${
                hiddenPostOptions === "hiddenPostOptions"
                  ? "hidden-post-kebab-menu-button"
                  : ""
              } ${
                searchUserObject.searchStatus ? "search-user-status" : ""
              } p-1 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm hover:bg-white`}
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
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className="post-text my-3 text-[17px]">{post.text}</p>

        <div className="post-medium-div w-full h-auto my-3">
          {post.medium.slice(-4) === ".jpg" ? (
            <img
              src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/medium/${post.medium}`}
              className="post-medium-img w-full h-auto rounded-sm"
              alt=""
            />
          ) : post.medium.slice(-4) === ".png" ? (
            <img
              src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/medium/${post.medium}`}
              className="post-medium-img w-full h-auto rounded-sm"
              alt=""
            />
          ) : post.medium.slice(-4) === ".mp4" ? (
            <video
              className="post-medium-video w-full h-auto rounded-sm"
              controls
            >
              <source
                src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/medium/${post.medium}`}
                type="video/mp4"
              />
            </video>
          ) : null}
        </div>

        <p className="timestamp mb-3 text-gray-400 text-base text-end">
          {post.timestamp}
        </p>
        <div className="button-div w-full py-5 flex justify-around items-center border border-t-gray-200 border-l-white border-r-white border-b-white">
          <div
            className={`edit-delete-div flex justify-center items-center gap-x-5 ${
              hiddenPostOptions === "hiddenPostOptions" ? "hidden" : ""
            } ${searchUserObject.searchStatus ? "hidden" : ""}`}
          >
            {" "}
            <button
              onClick={() => {
                openEditPostPopUp(post.id);
              }}
              className="edit-button px-2 py-1 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                openDeletePostPopUp(post.id);
              }}
              className="delete-button px-2 py-1 flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>

          <div className="like-dislike-div flex justify-center items-center gap-x-7">
            <button
              onClick={() => {
                checkLikeDislikePost(
                  likeDislikePostId,
                  post.id,
                  publicUserObject.userId,
                  "like",
                  prevLikeDislikePostType
                );
              }}
              className="like-button px-2 py-1 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`like-icon w-6 cursor-pointer ${
                  prevLikeDislikePostType === "like" ? "fill-green-500" : ""
                }`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
              <span className="like-labe">{likePostCount}</span>
            </button>
            <button
              onClick={() => {
                checkLikeDislikePost(
                  likeDislikePostId,
                  post.id,
                  publicUserObject.userId,
                  "dislike",
                  prevLikeDislikePostType
                );
              }}
              className="dislike-button px-2 py-1 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`dislike-icon w-6 cursor-pointer ${
                  prevLikeDislikePostType === "dislike" ? "fill-red-500" : ""
                }`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                />
              </svg>
              <span className="dislike-label">{dislikePostCount}</span>
            </button>
          </div>
          <button
            onClick={() => {
              openCommentPopUp(post.id);
            }}
            className="chat-button px-2 py-1 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="chat-icon w-7 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
            <span className="chat-label rounded-sm">{commentCount}</span>
          </button>
        </div>
      </div>
    </>
  );
  /*

      <Dialog open={noticeCommentPopUp} onOpenChange={setNoticeCommentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=""
        >
          <DialogDescription className="p-3 text-black flex flex-col gap-y-7">
            <div className="text-lg">
              Bitte füge deinem Kommentar Inhalt hinzu oder
              <br />
              klicke auf schließen.
            </div>
            <button
              onClick={() => {
                setNoticeCommentPopUp(false);
              }}
              className="px-3 py-1 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
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
      
  <Dialog
        open={noticeUpdateCommentPopUp}
        onOpenChange={setNoticeUpdateCommentPopUp}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=""
        >
          <DialogDescription className="px-3 py-5 text-black flex flex-col gap-y-10">
            <div className="text-lg">
              Bitte füge deinem Kommentar wieder Inhalt hinzu oder
              <br />
              klicke auf schließen und abbrechen.
            </div>
            <button
              onClick={() => {
                repeatEditComment(currentCommentId);
                setNoticeUpdateCommentPopUp(false);
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
