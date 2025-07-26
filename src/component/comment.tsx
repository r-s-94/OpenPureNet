import { publicUserContext } from "@/publicUserContext";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase";
import type { CommentObject } from "./post";

export default function Comment({
  comment,
  openEditCommentPopUp,
  openDeleteCommentPopUp,
}: {
  comment: CommentObject;
  openEditCommentPopUp: (commentId: number) => void;
  openDeleteCommentPopUp: (commentId: number) => void;
}) {
  const [likeDislikeCommentId, setLikeDislikeCommentId] = useState<number>(0);
  const [prevLikeDislikeCommentType, setPrevLikeDislikeCommentType] =
    useState<string>("");
  const [likeCommentCount, setLikeCommentCount] = useState<number>(0);
  const [dislikeCommentCount, setDislikeCommentCount] = useState<number>(0);
  const { publicUserObject } = useContext(publicUserContext);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: session } = await supabase.auth.getSession();

      const { data: like_dislike_comment } = await supabase
        .from("like-dislike-comments")
        .select()
        .eq("userId", session.session!.user.id)
        .eq("commentId", comment.id);

      const { count: like_comment_count } = await supabase
        .from("like-dislike-comments")
        .select("*", { count: "exact", head: true })
        .eq("commentId", comment.id)
        .eq("type", "like");

      const { count: dislike_comment_count } = await supabase
        .from("like-dislike-comments")
        .select("*", { count: "exact", head: true })
        .eq("commentId", comment.id)
        .eq("type", "dislike");

      if (like_dislike_comment) {
        if (like_dislike_comment[0] !== undefined) {
          setLikeDislikeCommentId(like_dislike_comment[0].id);
          setPrevLikeDislikeCommentType(like_dislike_comment[0].type);
        }
      }

      if (like_comment_count) {
        setLikeCommentCount(like_comment_count);
      } else {
        setLikeCommentCount(0);
      }

      if (dislike_comment_count) {
        setDislikeCommentCount(dislike_comment_count);
      } else {
        setDislikeCommentCount(0);
      }
    };

    fetchAllData();
  }, []);

  async function checkLikeDislikeComment(
    id: number,
    commentId: number,
    userId: string,
    currentLikeDislike: string,
    prevLikeDislike: string
  ) {
    if (currentLikeDislike === prevLikeDislike) {
      const {} = await supabase
        .from("like-dislike-comments")
        .delete()
        .eq("id", id);

      setLikeDislikeCommentId(0);
      setPrevLikeDislikeCommentType("");
      loadCommentCount(commentId);
    }

    if (currentLikeDislike !== prevLikeDislike) {
      const {} = await supabase
        .from("like-dislike-comments")
        .delete()
        .eq("id", id);

      const currentTimestamp = new Date().toLocaleString();

      const {} = await supabase.from("like-dislike-comments").insert({
        userId: userId,
        type: currentLikeDislike,
        timestampe: currentTimestamp,
        commentId: commentId,
      });

      loadLikeDislikeComment(commentId);
      loadCommentCount(commentId);
    }
  }

  async function loadLikeDislikeComment(commentId: number) {
    const { data: session } = await supabase.auth.getSession();

    const { data: like_dislike_comment } = await supabase
      .from("like-dislike-comments")
      .select()
      .eq("userId", session.session!.user.id)
      .eq("commentId", commentId);

    if (like_dislike_comment) {
      if (like_dislike_comment[0] !== undefined) {
        setLikeDislikeCommentId(like_dislike_comment[0].id);
        setPrevLikeDislikeCommentType(like_dislike_comment[0].type);
      }
    }
  }

  async function loadCommentCount(commentId: number) {
    const { count: like_comment_count } = await supabase
      .from("like-dislike-comments")
      .select("*", { count: "exact", head: true })
      .eq("commentId", commentId)
      .eq("type", "like");

    const { count: dislike_comment_count } = await supabase
      .from("like-dislike-comments")
      .select("*", { count: "exact", head: true })
      .eq("commentId", commentId)
      .eq("type", "dislike");

    if (like_comment_count) {
      setLikeCommentCount(like_comment_count);
    } else {
      setLikeCommentCount(0);
    }

    if (dislike_comment_count) {
      setDislikeCommentCount(dislike_comment_count);
    } else {
      setDislikeCommentCount(0);
    }
  }

  return (
    <div className="my-5 p-4 border border-gray-300 shadow-lg rounded-sm ">
      <div className="flex justify-start items-center gap-x-3">
        {publicUserObject.profilPicture !== "" ? (
          <img
            src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${comment.public_user.profilPicture}`}
            className="w-13 h-13 bg-cover rounded-[50%]"
            alt=""
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-7 text-blue-400 rounded-sm hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        )}
        <p className="">{comment.public_user.Profilname}</p>
      </div>

      <p className="">{comment.comment}</p>
      <p className="text-end">{comment.timestamp}</p>
      <div className="pt-3 flex justify-around items-center border border-t-gray-200 border-l-white border-r-white border-b-white">
        <div className="flex justify-center items-center gap-x-5">
          <button
            onClick={() => {
              openEditCommentPopUp(comment.id);
            }}
            className={`${
              comment.userId === publicUserObject.userId ? "" : "hidden"
            } px-2 py-0.5 flex justify-center items-center gap-x-1 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400`}
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
              openDeleteCommentPopUp(comment.id);
            }}
            className={`${
              comment.userId === publicUserObject.userId ? "" : "hidden"
            } px-2 py-0.5 flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500`}
          >
            {" "}
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
        <div className="flex justify-center items-center gap-x-5">
          <button
            onClick={() => {
              checkLikeDislikeComment(
                likeDislikeCommentId,
                comment.id,
                publicUserObject.userId,
                "like",
                prevLikeDislikeCommentType
              );
            }}
            className="px-2 py-0.5 flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm hover:bg-white cursor-pointer"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`w-6 cursor-pointer ${
                prevLikeDislikeCommentType === "like" ? "fill-green-500" : ""
              }`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
            <span className="">{likeCommentCount}</span>
          </button>
          <button
            onClick={() => {
              checkLikeDislikeComment(
                likeDislikeCommentId,
                comment.id,
                publicUserObject.userId,
                "dislike",
                prevLikeDislikeCommentType
              );
            }}
            className="px-2 py-0.5 flex justify-center items-center gap-x-1 bg-gray-50 hover:bg-white border border-white rounded-sm cursor-pointer"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`w-6 cursor-pointer ${
                prevLikeDislikeCommentType === "dislike" ? "fill-red-500" : ""
              }`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
              />
            </svg>
            <span className="">{dislikeCommentCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
