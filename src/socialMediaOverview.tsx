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
  const { userInfoObject } = useContext(userContext);
  const navigation = useNavigate();

  useEffect(() => {
    loadPost();
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

  async function addNewPost() {
    const {} = await supabase.from("Social-Media-Post-Table").insert({
      UserId: userInfoObject.id,
      UserProfilName: userInfoObject.profilName,
      Post: newPost,
      Date: "",
    });

    setNewPost("");
    loadPost();
  }

  async function logOut() {
    const {} = await supabase.auth.signOut();
    navigation("/");
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
