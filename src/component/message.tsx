import "./message.css";
import { messageContext } from "@/messageContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase";
import { searchUserContext } from "@/searchUserContext";
import { publicUserContext } from "@/publicUserContext";
//import { functionContext } from "@/functionContext";
import "../responsive.css";
import Nav from "@/nav";
import { navContext } from "@/navContext";

export default function Message() {
  //const [followRequestId, setFollowRequestId] = useState<number>(0);
  const { publicUserObject } = useContext(publicUserContext);
  const { globalSearchUserObject, setGlobalSearchUserObject } =
    useContext(searchUserContext);
  const { messageArray, setMessageArray } = useContext(messageContext);
  //const { checkUserSession } = useContext(functionContext);
  const navigation = useNavigate();
  const { setCurrentActiveNavArea } = useContext(navContext);

  useEffect(() => {
    const loadMessageData = async () => {
      //let followId = 0;

      const { data: session } = await supabase.auth.getSession();

      if (session.session) {
        const { data: follow } = await supabase
          .from("follow")
          .select(
            "id, public_user: user_id (id, user_id, profil_name, profil_picture)",
          )
          .eq(
            "follow_user_id",
            publicUserObject.user_id || session.session.user.id,
          )
          .eq("follow_request", false);

        console.log(follow);

        if (follow && follow.length > 0) {
          const sortedMessageArray = follow.sort(
            (a, b) => b.public_user.id - a.public_user.id,
          );

          setMessageArray(sortedMessageArray);

          console.log(follow);

          for (const followEntry of follow) {
            console.log(followEntry.id);
            //followId = followEntry.id;

            const {} = await supabase
              .from("follow")
              .update({ is_seen: true })
              .eq("id", followEntry.id);
          }
        }
      }

      //followId = 0;
    };

    setCurrentActiveNavArea("message");

    loadMessageData();
  }, []);

  async function checkFollowRequest(id: number, follow: boolean) {
    //console.log(followRequestId, follow);

    const currentTimestamp = new Date().toLocaleString();

    const {} = await supabase
      .from("follow")
      .update({
        follow_request: follow,
        follow_request_timestamp: currentTimestamp,
      })
      .eq("id", id);

    const filteredMessageArray = messageArray.filter((message) => {
      return message.id !== id;
    });

    setMessageArray(filteredMessageArray);
  }

  async function toUser(userId: string) {
    const { data } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", userId);

    if (data) {
      const searchUserData = data[0];
      console.log(searchUserData);

      setCurrentActiveNavArea("user");

      setGlobalSearchUserObject({
        ...globalSearchUserObject,
        id: searchUserData.id,
        user_id: searchUserData.user_id,
        profil_name: searchUserData.profil_name,
        profil_picture: searchUserData.profil_picture,
        status_text: searchUserData.status_text,
        from_message: true,
      });

      navigation(`/private-route/user/${userId}`);
    }
  }

  return (
    <section className="message-section h-screen">
      <Nav />

      <h2 className="message-section-headline mt-3 mb-7 text-center text-3xl">
        Nachrichten
      </h2>

      <div className="message-section-overview-div w-[40%] h-[48rem] mx-auto px-1 py-1 flex flex-col gap-y-7 overflow-y-scroll  rounded-sm">
        {messageArray.map((message) => {
          return (
            <div className="message-section-message-div py-10 flex flex-col items-center justify-center gap-y-10 bg-white shadow-lg border border-gray-200 rounded-sm">
              <div className="message-section-user-info-div text-lg flex justify-center items-center gap-x-3">
                {message.public_user.profil_picture !== "" ? (
                  <img
                    src={`https://pmhsscblwzipolnmirow.supabase.co/storage/v1/object/public/profilepicture/${message.public_user.profil_picture}`}
                    className="message-section-user-picture w-13 h-13 bg-cover rounded-full"
                    alt=""
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="message-section-user-icon w-10 text-blue-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                )}{" "}
                {message.public_user.profil_name} folgt dir, <wbr /> möchtest du
                ihm auch folgen?
              </div>

              <div className="message-section-button-div w-[75%] flex justify-around items-center">
                <div className="message-section-primary-button-div flex justify-center align-center gap-x-3">
                  <button
                    onClick={() => {
                      checkFollowRequest(message.id, true);
                    }}
                    className="message-section-follow-true-button px-5 py-2 text-base flex justify-center items-center gap-x-3 bg-blue-500 text-white border border-white rounded-sm cursor-pointer transition-all duration-500 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500"
                  >
                    ja
                  </button>{" "}
                  <button
                    onClick={() => {
                      checkFollowRequest(message.id, false);
                    }}
                    className="message-section-follow-false-button px-5 py-2 text-base text-black flex justify-center items-center gap-x-1 bg-gray-200 border border-gray-300 rounded-sm cursor-pointer transition-all duration-500 ease-in-out hover:bg-white"
                  >
                    nein
                  </button>
                </div>

                <button
                  onClick={() => {
                    toUser(message.public_user.user_id);
                  }}
                  className="message-section-show-profil-button px-7 py-2 text-base flex justify-center items-center gap-x-3 bg-white text-blue-500 border border-blue-500 rounded-sm cursor-pointer transition-all duration-500 ease-in-out hover:bg-blue-100"
                >
                  Profil anzeigen
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
