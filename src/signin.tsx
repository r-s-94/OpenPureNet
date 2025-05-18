import { useState } from "react";
import "./signin.css";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [userMail, setUserMail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const navigation = useNavigate();

  async function signIn() {
    if (userMail !== "" && userPassword !== "") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userMail,
        password: userPassword,
      });

      console.log(data);

      if (
        error?.code === "invalid_credentials" ||
        error?.code === "email_address_invalid" ||
        error?.status === 400
      ) {
        alert();
        setUserMail("");
        setUserPassword("");
      } else {
        navigation("overview");
        setUserMail("");
        setUserPassword("");
      }
    } else {
      alert();
    }
  }

  return (
    <div className="signin-div">
      <h1>Anmeldung</h1>
      <div className="signin-form">
        <input
          type="text"
          value={userMail}
          onChange={(event) => {
            setUserMail(event.target.value);
          }}
          name=""
        />
        <input
          type="password"
          value={userPassword}
          onChange={(event) => {
            setUserPassword(event.target.value);
          }}
          name=""
        />
        <button onClick={signIn}>Anmelden</button>
      </div>
    </div>
  );
  //
}
