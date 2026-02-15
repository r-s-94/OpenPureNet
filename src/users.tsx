import "./users.css";
import Nav from "./nav";
import { useContext, useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription } from "./components/ui/dialog";
import type { Tables } from "./database.types";
import { supabase } from "./supabase";
import { searchUserContext } from "./searchUserContext";
import { useNavigate } from "react-router-dom";
import { navContext } from "./navContext";
/*export interface SearchUserDatatype {
  id: number;
  name: string;
  text: string;
  picture: string;
  status: boolean;
}*/

export default function Users() {
  const [searchUserPopUp, setSearchUserPopUp] = useState<boolean>(false);
  const [searchUserArray, setSerachUserArray] = useState<
    Tables<"public_user">[]
  >([]);
  const [inputSearchUser, setInputSearchUser] = useState<string>("");
  const { globalSearchUserObject, setGlobalSearchUserObject } =
    useContext(searchUserContext);
  const navigation = useNavigate();
  const { setCurrentActiveNavArea } = useContext(navContext);
  /*const [searchUserObject, setSearchUserObject] = useState<SearchUserDatatype>({
    id: 0,
    name: "",
    text: "",
    picture: "",
    status: false,
  });*/

  useEffect(() => {
    setCurrentActiveNavArea("users");
  }, []);

  async function searchUser() {
    const { data } = await supabase
      .from("public_user")
      .select()
      .ilike("profil_name", inputSearchUser);

    console.log(data);

    if (data) {
      setSerachUserArray(data);
    }
  }

  async function toSearchUser(userId: string) {
    const { data } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", userId);

    if (data) {
      const searchUserData = data[0];
      console.log(searchUserData);

      setCurrentActiveNavArea("user");
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
        id: searchUserData.id,
        user_id: searchUserData.user_id,
        profil_name: searchUserData.profil_name,
        profil_picture: searchUserData.profil_picture,
        status_text: searchUserData.status_text,
        search_status: true,
        from_message: false,
      });

      navigation(`/private-route/user/${userId}`);
    }
  }

  return (
    <section className="users-section h-screen">
      <Nav />
      <Dialog open={searchUserPopUp} onOpenChange={setSearchUserPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="search-user-popup !max-w-xl h-[90%]"
        >
          <DialogDescription className="search-user-popup-description py-5 flex flex-col items-center justify-center gap-y-7">
            <div className="search-user-popup-input-button-div flex justify-center items-center gap-x-5">
              <input
                type="text"
                value={inputSearchUser}
                onChange={(event) => {
                  setInputSearchUser(event.target.value.trimStart());
                }}
                name=""
                className="search-user-popup-input w-[17rem] h-[3.2rem] bg-white pl-3 text-xl border border-gray-400 rounded-sm"
                placeholder="Profilnamen eingeben"
              />
              <button
                onClick={searchUser}
                disabled={inputSearchUser.length > 0 ? false : true}
                className={`search-user-popup-search-button mx-auto px-5 py-3 text-lg flex justify-center items-center gap-x-3 transition-all duration-500 ease-in-out ${inputSearchUser.length > 0 ? "bg-blue-500 text-white border border-white cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} rounded-sm`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="search-user-popup-search-icon w-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
            <div className="search-user-popup-user-overview-div w-full h-full gap-y-3 overflow-auto rounded-sm">
              {searchUserArray.map((searchUser) => {
                return (
                  <div
                    onClick={() => {
                      toSearchUser(searchUser.user_id);
                    }}
                    className="search-user-popup-user-div p-7 flex bg-white justify-start items-center gap-x-3 shadow-lg border border-gray-300 cursor-pointer rounded-sm"
                  >
                    {" "}
                    {searchUser.profil_picture !== "" ? (
                      <img
                        src={`https://pmhsscblwzipolnmirow.supabase.co/storage/v1/object/public/profilepicture/${searchUser.profil_picture}`}
                        className="search-user-popup-user-picture w-15 h-15 bg-cover rounded-full"
                        alt=""
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="search-user-popup-user-icon w-10 h-10 text-blue-500 bg-cover rounded-full"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    )}
                    <p className="search-user-popup-user-name text-lg">
                      {searchUser.profil_name}
                    </p>
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
                  setGlobalSearchUserObject({
                    ...globalSearchUserObject,
                    search_status: false,
                  });
                  setSearchUserPopUp(false);
                }}
                className="search-user-popup-close-button mr-3 px-2 py-0.5 flex justify-center items-center gap-x-1 text-lg transition-all duration-500 ease-in-out bg-gray-200 text-black border border-gray-300 rounded-sm cursor-pointer hover:bg-white"
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

      <div className="search-users-div">
        <button
          onClick={() => {
            setSearchUserPopUp(true);
            console.log("Check");
          }}
          className="search-user-button mx-auto mt-3 px-3 py-2 flex flex-col items-center justify-center bg-blue-500 text-white transition-all duration-500 ease-in-out border border-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500 rounded-sm cursor-pointer"
        >
          <div className="flex justify-center align-center gap-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="search-icon w-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="users-icon w-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>

          <span className="user-search-label interaction-label">
            User suchen
          </span>
        </button>{" "}
      </div>
    </section>
  );

  /*id={0} name={""} text={""} picture={""} status={false} 
  
  */
}
