import { messageContext } from "@/messageContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase";
import { serachUserContext } from "@/searchUserContext";
import { publicUserContext } from "@/publicUserContext";
import { functionContext } from "@/functionContext";

export default function Message() {
  const [followRequestId, setFollowRequestId] = useState<number>(0);
  const { publicUserObject } = useContext(publicUserContext);
  const { searchUserObject, setSearchUserObject } =
    useContext(serachUserContext);
  const { messageArray, setMessageArray } = useContext(messageContext);
  const { checkUserSession } = useContext(functionContext);
  const navigation = useNavigate();

  useEffect(() => {
    const loadMessageData = async () => {
      let followId = 0;

      const { data: follow } = await supabase
        .from("follow")
        .select(
          "id, public_user: userId (id, userId, Profilname, profilPicture)"
        )
        .eq("FollowUserId", publicUserObject.userId)
        .is("followRequest", null);

      console.log(follow);

      if (follow && follow.length > 0) {
        const sortedMessageArray = follow.sort(
          (a, b) => b.public_user.id - a.public_user.id
        );

        setMessageArray(sortedMessageArray);

        console.log(follow);

        for (const followEntry of follow) {
          console.log(followEntry.id);
          followId = followEntry.id;

          const {} = await supabase
            .from("follow")
            .update({ is_seen: true })
            .eq("id", followId);
        }

        followId = 0;
      }
    };

    loadMessageData();
  }, []);

  function toOverview() {
    checkUserSession();
    navigation("/private-route/overview");
  }

  async function checkFollowRequest(id: number, follow: boolean) {
    console.log(followRequestId, follow);

    const currentTimestamp = new Date().toLocaleString();

    const {} = await supabase
      .from("follow")
      .update({
        followRequest: follow,
        followRequestTimestamp: currentTimestamp,
      })
      .eq("id", id);

    const filteredMessageArray = messageArray.filter((message) => {
      return message.public_user.id !== id;
    });

    setMessageArray(filteredMessageArray);
  }

  function toUser(userId: string) {
    setSearchUserObject({
      ...searchUserObject,
      fromMessage: true,
    });

    navigation(`/private-route/user/${userId}`);
  }

  return (
    <section>
      <button onClick={toOverview} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-13 mt-10 ml-30"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <div className="h-[80vh]">
        <h2 className="mb-10 text-center text-3xl">Nachrichten</h2>
        <div className="w-[50%] h-[97%] mx-auto p-7 flex flex-col gap-y-7 bg-gray-50 border border-gray-400 overflow-y-scroll rounded-sm">
          {messageArray.map((message) => {
            return (
              <div className="p-5 flex flex-col items-center justify-center gap-y-3 bg-white shadow-lg border border-gray-200 rounded-sm">
                <div>
                  <div className="text-lg flex justify-center items-center gap-x-3">
                    <img
                      src={`https://eypauwdeqovcsrjwuxtj.supabase.co/storage/v1/object/public/profilepicture/${message.public_user.profilPicture}`}
                      className="w-13 h-13 bg-cover rounded-full"
                      alt=""
                    />{" "}
                    {message.public_user.Profilname} folgt dir, möchtest du ihm
                    auch folgen?
                  </div>
                </div>
                <div className="flex justify-center items-center gap-x-5">
                  <button
                    onClick={() => {
                      checkFollowRequest(message.public_user.id, false);
                    }}
                    className="px-5 py-2 text-[17px] text-black flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
                  >
                    nein
                  </button>
                  <button
                    onClick={() => {
                      checkFollowRequest(message.public_user.id, true);
                    }}
                    className="px-5 py-2 text-lg flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                  >
                    ja
                  </button>
                  <button
                    onClick={() => {
                      toUser(message.public_user.userId);
                    }}
                    className="px-5 py-2 text-lg flex justify-center items-center gap-x-3 bg-blue-400 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-400 hover:border-blue-400"
                  >
                    Profil anzeigen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
