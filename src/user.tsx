import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "./userContext";
import { socialMediaPostContext } from "./socialMediaPostContext";
//import { SocialMediaPostArray } from "./socialMediaPostContext";

export default function User() {
  const [newUserPost, setNewUserPost] = useState<string>("");
  const { userInfoObject } = useContext(userContext);
  const { socialMediaPostArray } = useContext(socialMediaPostContext);
  /*const [userPostArray, setUserPostArray] = useState<SocialMediaPostArray[]>(
    []
  );*/

  const filteredUserArray = socialMediaPostArray.filter((post) => {
    return post.UserId === userInfoObject.userId;
  });

  const sortedUserPostArray = filteredUserArray.sort((a, b) => b.id - a.id);

  async function addPost() {}

  async function updatePost(userId: number) {
    const x = userId;
  }

  async function deletePost(userId: number) {
    const x = userId;
  }

  return (
    <>
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
        <textarea
          value={newUserPost}
          onChange={(event) => {
            setNewUserPost(event.target.value);
          }}
          name=""
        ></textarea>
        <button onClick={addPost}>Posten</button>
      </div>

      {sortedUserPostArray.map((post) => {
        return (
          <div>
            <p>{post.UserProfilName}</p>
            <p>{post.Post}</p>
            <button
              onClick={() => {
                updatePost(post.id);
              }}
            ></button>
            <button
              onClick={() => {
                deletePost(post.id);
              }}
            ></button>
          </div>
        );
      })}
    </>
  );
}
