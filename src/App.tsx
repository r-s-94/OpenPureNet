import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./signin";
import Overview from "./overview";
import User from "./user";
import Settings from "./settings";
import { useEffect, useState } from "react";
import type { Tables } from "./database.types";
import { publicUserContext } from "./publicUserContext";
import Impressum from "./component/impressum";
import AGB from "./component/agb";
import DataProtection from "./component/dataProtection";
import type { UserAuthObject } from "./userAuthContext";
import { userAuthContext } from "./userAuthContext";
import PrivateRoute from "./privateRoute";
import { supabase } from "./supabase";
import { serachUserContext } from "./searchUserContext";
import type { SearchUserObject } from "./searchUserContext";
import Message from "./component/message";
import { messageContext } from "./messageContext";
import type { MessageObject } from "./messageContext";
import { postsContext } from "./postContext";
import { functionContext } from "./functionContext";
import UpadatePassword from "./updatePassword";
import type { PostObject } from "./postContext";
import ForgotPassword from "./forgotPassword";

function App() {
  const [postsArray, setPostsArray] = useState<PostObject[]>([]);

  const [publicUserObject, setPublicUserObject] = useState<
    Tables<"public-user">
  >({
    id: 0,
    Profilname: "",
    profilPicture: "",
    Statustext: "",
    userId: "",
    AGBConsent: false,
    dataProtectionConsent: false,
    userDataConsent: false,
  });

  const [userAuthObject, setUserAuthObject] = useState<UserAuthObject>({
    accessToken: "",
    isAuthenticated: false,
  });

  const [searchUserObject, setSearchUserObject] = useState<SearchUserObject>({
    id: 0,
    userId: "",
    Profilname: "",
    profilPicture: "",
    AGBConsent: false,
    dataProtectionConsent: false,
    userDataConsent: false,
    Statustext: "",
    searchStatus: false,
    fromMessage: false,
  });

  const [messageArray, setMessageArray] = useState<MessageObject[]>([]);

  const [messageCount, setMessageCount] = useState<number>(0);

  const [consentPopUp, setConsentPopUp] = useState<boolean>(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignIn />,
    },
    {
      path: "private-route",
      element: <PrivateRoute />,
      children: [
        {
          path: "overview",
          element: <Overview />,
        },
        {
          path: "user/:userId",
          element: <User />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "message",
          element: <Message />,
        },
      ],
    },

    {
      path: "impressum",
      element: <Impressum />,
    },
    {
      path: "agb",
      element: <AGB />,
    },
    {
      path: "data-protection",
      element: <DataProtection />,
    },
    {
      path: "forget-password",
      element: <ForgotPassword />,
    },
    {
      path: "update-password",
      element: <UpadatePassword />,
    },
  ]);

  async function checkUserSession() {
    const { data: session } = await supabase.auth.getSession();

    const { data: public_user } = await supabase
      .from("public-user")
      .select()
      .eq("userId", session.session!.user.id);

    const { count: followCount } = await supabase
      .from("follow")
      .select("*", { count: "exact" })
      .eq("follow", true)
      .eq("FollowUserId", session.session!.user.id)
      .is("followRequest", null)
      .eq("is_seen", false);

    if (session.session) {
      setUserAuthObject({
        ...userAuthObject,
        accessToken: session.session.access_token,
        isAuthenticated: true,
      });
    }

    if (public_user && public_user[0] !== undefined) {
      const publicUserData = public_user[0];

      if (
        publicUserData.AGBConsent === false ||
        publicUserData.dataProtectionConsent === false ||
        publicUserData.userDataConsent === false
      ) {
        setConsentPopUp(true);
      }

      setPublicUserObject({
        ...publicUserObject,
        id: publicUserData.id,
        userId: publicUserData.userId,
        Profilname: publicUserData.Profilname,
        profilPicture: publicUserData.profilPicture,
        Statustext: publicUserData.Statustext,
        AGBConsent: publicUserData.AGBConsent,
        dataProtectionConsent: publicUserData.dataProtectionConsent,
        userDataConsent: publicUserData.userDataConsent,
      });
    }

    if (followCount) {
      setMessageCount(followCount);
    } else {
      setMessageCount(0);
    }
  }

  async function logOut() {
    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      Profilname: "",
      userId: "",
      profilPicture: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      accessToken: "",
    });

    setSearchUserObject({
      ...searchUserObject,
      id: 0,
      userId: "",
      Profilname: "",
      profilPicture: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
      Statustext: "",
      searchStatus: false,
      fromMessage: false,
    });

    setMessageArray([]);
  }

  return (
    <functionContext.Provider
      value={{ consentPopUp, setConsentPopUp, checkUserSession, logOut }}
    >
      <userAuthContext.Provider value={{ userAuthObject, setUserAuthObject }}>
        <publicUserContext.Provider
          value={{ publicUserObject, setPublicUserObject }}
        >
          <serachUserContext.Provider
            value={{ searchUserObject, setSearchUserObject }}
          >
            <messageContext.Provider
              value={{
                messageArray,
                setMessageArray,
                messageCount,
                setMessageCount,
              }}
            >
              <postsContext.Provider value={{ postsArray, setPostsArray }}>
                <div className="open-pure-net">
                  <RouterProvider router={router} />
                </div>
              </postsContext.Provider>
            </messageContext.Provider>
          </serachUserContext.Provider>
        </publicUserContext.Provider>
      </userAuthContext.Provider>
    </functionContext.Provider>
  );
}

export default App;
