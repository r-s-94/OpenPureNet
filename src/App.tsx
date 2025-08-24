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
    Tables<"public_user">
  >({
    id: 0,
    profilName: "",
    profilPicture: "",
    statusText: "",
    userId: "",
    agbConsent: false,
    dataProtectionConsent: false,
    userConsent: false,
  });

  const [userAuthObject, setUserAuthObject] = useState<UserAuthObject>({
    accessToken: "",
    isAuthenticated: false,
  });

  const [searchUserObject, setSearchUserObject] = useState<SearchUserObject>({
    id: 0,
    userId: "",
    profilName: "",
    profilPicture: "",
    agbConsent: false,
    dataProtectionConsent: false,
    userConsent: false,
    statusText: "",
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

    console.log(session.session?.user);

    const { data: public_user } = await supabase
      .from("public_user")
      .select()
      .eq("userId", session.session!.user.id);

    const { count: followCount } = await supabase
      .from("follow")
      .select("*", { count: "exact" })
      .eq("follow", true)
      .eq("followUserId", session.session!.user.id)
      .is("followRequest", null)
      .eq("is_seen", false);

    if (session.session) {
      const publicUserData = public_user![0];

      if (public_user && public_user?.length > 0) {
        setPublicUserObject({
          ...publicUserObject,
          id: publicUserData.id,
          userId: session.session?.user.id,
          profilName: publicUserData.profilName,
          profilPicture: publicUserData.profilPicture,
          statusText: publicUserData.statusText,
          agbConsent: publicUserData.agbConsent,
          dataProtectionConsent: publicUserData.dataProtectionConsent,
          userConsent: publicUserData.userConsent,
        });
      }

      setUserAuthObject({
        ...userAuthObject,
        accessToken: session.session.access_token,
        isAuthenticated: true,
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
      profilName: "",
      userId: "",
      profilPicture: "",
      agbConsent: false,
      dataProtectionConsent: false,
      userConsent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      accessToken: "",
    });

    setSearchUserObject({
      ...searchUserObject,
      userId: "",
      profilName: "",
      profilPicture: "",
      agbConsent: false,
      dataProtectionConsent: false,
      userConsent: false,
      statusText: "",
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
