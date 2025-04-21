import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "./userContext";
import { socialMediaPostContext } from "./socialMediaPostContext";
//import { SocialMediaPostArray } from "./socialMediaPostContext";
import { supabase } from "./supabase";
import "./user.css";

export default function User() {
  const [userProfileName, setUserProfilName] = useState<string>("");
  const [newUserPost, setNewUserPost] = useState<string>("");
  const [updateUserPostPopUp, setUpdateUserPostPopUp] =
    useState<boolean>(false);
  const [updateUserPost, setUpdateUserPost] = useState<string>("");
  const [selectedUserPostId, setSelectedUserPostId] = useState<number>(0);
  const { userInfoObject, setUserInfoObject } = useContext(userContext);
  const { socialMediaPostArray, setSocialMediaPostArray } = useContext(
    socialMediaPostContext
  );
  /*const [userPostArray, setUserPostArray] = useState<SocialMediaPostArray[]>(
    []
  );*/

  useEffect(() => {
    const loadAllOfUser = async () => {
      const { data: session } = await supabase.auth.getSession();

      const { data: post } = await supabase
        .from("Social-Media-Post-Table")
        .select()
        .order("id");

      if (session.session?.user.id) {
        setUserInfoObject({
          ...userInfoObject,
          authenticatedUserId: session.session.user.id,
        });
      }

      if (post) {
        const correctUser = post.filter((post) => {
          return post.UserId === session.session?.user.id;
        });

        const sortedPostArray = correctUser.sort((a, b) => b.id - a.id);

        setSocialMediaPostArray(sortedPostArray);
      }
    };

    loadAllOfUser();
  }, []);

  async function loadPost() {
    const { data } = await supabase
      .from("Social-Media-Post-Table")
      .select()
      .order("id");

    if (data) {
      const correctUser = data.filter((post) => {
        return post.UserId === userInfoObject.authenticatedUserId;
      });

      const sortedPostArray = correctUser.sort((a, b) => b.id - a.id);

      setSocialMediaPostArray(sortedPostArray);
    }
  }

  function checkProfilname(userTableId: number) {
    if (userTableId) {
      newProfilName();
    } else {
      updateProfilName(userTableId);
    }
  }

  async function newProfilName() {
    console.log(userInfoObject.authenticatedUserId);

    const {} = await supabase.from("Social-Media-User-Table").insert({
      UserId: userInfoObject.authenticatedUserId,
      UserProfilname: userProfileName,
    });

    setUserProfilName("");
  }

  async function updateProfilName(userTableId: number) {
    console.log(userInfoObject.authenticatedUserId);

    const {} = await supabase
      .from("Social-Media-User-Table")
      .update({ UserProfilname: userProfileName })
      .eq("id", userTableId);
  }

  async function addUserPost() {
    const currentDate = new Date().toLocaleString();

    const {} = await supabase.from("Social-Media-Post-Table").insert({
      UserId: userInfoObject.authenticatedUserId,
      UserProfilname: userInfoObject.profilName,
      Post: newUserPost,
      Date: currentDate,
    });

    setNewUserPost("");
    loadPost();
  }

  function openUpdateUserPost(postId: number) {
    const selectedUserPost = socialMediaPostArray.find((post) => {
      return post.id === postId;
    });

    if (selectedUserPost?.Post) {
      setUpdateUserPost(selectedUserPost.Post);
      setSelectedUserPostId(selectedUserPost.id);
    }

    setUpdateUserPostPopUp(true);
  }

  async function editUserPost() {
    const updateCurrentDate = new Date().toLocaleString();

    const {} = await supabase
      .from("Social-Media-Post-Table")
      .update({
        Post: updateUserPost,
        Date: updateCurrentDate,
        UserProfilname: userInfoObject.profilName,
      })
      .eq("id", selectedUserPostId);

    setUpdateUserPostPopUp(false);
    setUpdateUserPost("");
    loadPost();
  }

  async function deleteUserPost(postId: number) {
    const {} = await supabase
      .from("Social-Media-Post-Table")
      .delete()
      .eq("id", postId);

    loadPost();
  }

  return (
    <div className="user-div">
      {updateUserPostPopUp && (
        <div className="popup-window-div">
          <div className="popup-message-div">
            <textarea
              value={updateUserPost}
              onChange={(event) => {
                setUpdateUserPost(event.target.value);
              }}
              name=""
            ></textarea>
            <div className="update-user-post-button-div">
              <button onClick={editUserPost}>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="edit-icon"
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
                  setUpdateUserPostPopUp(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="break-icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>User</h1>
      <Link to="/socialMediaOverview">
        <button className="back-button button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="back-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </Link>

      <div>
        Profilname ändern:
        <input
          type="text"
          value={userProfileName}
          onChange={(event) => {
            setUserProfilName(event.target.value);
          }}
          name=""
        />
        <button
          onClick={() => {
            checkProfilname(userInfoObject.userTableId);
          }}
        >
          Profilname ändern
        </button>
      </div>

      <div>
        <textarea
          value={newUserPost}
          onChange={(event) => {
            setNewUserPost(event.target.value);
          }}
          name=""
        ></textarea>
        <button onClick={addUserPost}>Posten</button>
      </div>

      {socialMediaPostArray.map((post) => {
        return (
          <div>
            <p>{post.UserProfilname}</p>
            <p>{post.Post}</p>
            <span>{post.Date}</span>

            <button
              onClick={() => {
                openUpdateUserPost(post.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="edit-icon"
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
                deleteUserPost(post.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="delete-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
  /*
   
  */
}
