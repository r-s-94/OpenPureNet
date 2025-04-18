import "./socialMediaOverview.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useContext, useEffect, useState } from "react";
import { socialMediaPostContext } from "./socialMediaPostContext";
import { userContext } from "./userContext";

export default function SocialMediaOverview() {
  const [newPost, setNewPost] = useState<string>("");
  const { socialMediaPostArray, setSocialMediaPostArray } = useContext(
    socialMediaPostContext
  );
  const { userInfoObject, setUserInfoObject } = useContext(userContext);
  const navigation = useNavigate();

  useEffect(() => {
    loadPost();
    loadUserData();
  }, []);

  async function loadPost() {
    const { data } = await supabase
      .from("Social-Media-Post-Table")
      .select()
      .order("id");

    if (data) {
      const sortedPostArray = data.sort((a, b) => b.id - a.id);
      setSocialMediaPostArray(sortedPostArray);
    }
  }

  async function loadUserData() {
    const { data } = await supabase
      .from("Social-Media-User-Table")
      .select()
      .order("id");

    if (data) {
      const findUser = data.find((user) => {
        return user.UserId === userInfoObject.authenticatedUserId;
      });

      if (findUser?.UserProfilname) {
        setUserInfoObject({
          authenticatedUserId: findUser.UserId,
          userTableId: findUser.id,
          profilName: findUser.UserProfilname,
        });
      }
    }
  }

  async function addNewPost() {
    const currentDate = new Date().toLocaleString();

    const { error } = await supabase.from("Social-Media-Post-Table").insert({
      UserId: userInfoObject.authenticatedUserId,
      UserProfilname: userInfoObject.profilName,
      Post: newPost,
      Date: currentDate,
    });

    setNewPost("");
    loadPost();
  }

  async function logOut() {
    const {} = await supabase.auth.signOut();
    navigation("/");

    setUserInfoObject({
      userTableId: 0,
      authenticatedUserId: "",
      profilName: "",
    });
  }

  return (
    <>
      <h1>Hallo</h1>

      <Link to="/user">
        <div className="user">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="user-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          {userInfoObject.profilName}
        </div>
      </Link>

      <button onClick={logOut}>Ausloggen</button>

      <div className="new-post-div">
        <textarea
          value={newPost}
          onChange={(event) => {
            setNewPost(event.target.value);
          }}
          name=""
        ></textarea>
        <button onClick={addNewPost}>Posten</button>
      </div>

      {socialMediaPostArray.map((post) => {
        return (
          <div>
            <p>{post.UserProfilname}</p>
            <p>{post.Post}</p>
            <span>{post.Date}</span>
          </div>
        );
      })}
    </>
  );
}
