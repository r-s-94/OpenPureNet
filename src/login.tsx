import "./login.css";
import Social_Media_Logo from "./assets/file_00000000ee0c62439f43a8742db56e32_conversation_id=67f35b16-4744-8007-a628-17eeb6144e1f&message_id=69f1568f-bddb-48da-ad56-48b9123c8e49.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
//import { userContext } from "./userContext";

export default function LogIn() {
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  //const { userInfoObject, setUserInfoObject } = useContext(userContext);
  const navigation = useNavigate();

  async function checkUser() {
    if (userName !== "" && userPassword !== "") {
      const { data } = await supabase.auth.signInWithPassword({
        email: userName,
        password: userPassword,
      });

      if (data) {
        console.log(data);
        /*setUserInfoObject({
          ...userInfoObject,
          userId: data.user?.id,
          userName: data.user?.email,
        });*/
        navigation("socialMediaOverview");
        setUserName("");
        setUserPassword("");
      }
    } else {
      alert();
    }
  }

  return (
    <>
      <div className="social-media-head-div">
        <h1 className="social-media-headline2">OpenPureNet</h1>
        <img src={Social_Media_Logo} className="social-media-logo" alt="" />
      </div>
      <div className="social-media-login-div">
        <label htmlFor="">
          Benutzername:{" "}
          <input
            type="text"
            value={userName}
            onChange={(event) => {
              setUserName(event.target.value);
            }}
            name=""
          />
        </label>
        <label htmlFor="">
          Passwort:{" "}
          <input
            type="password"
            value={userPassword}
            onChange={(event) => {
              setUserPassword(event.target.value);
            }}
            name=""
          />
        </label>
        <button onClick={checkUser}>Anmelden</button>
      </div>
    </>
  );
}
