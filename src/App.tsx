import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./signin";
import Overview from "./overview";
import User from "./user";
import Settings from "./settings";
import { useEffect, useState } from "react";
import type { Tables } from "./database.types";
import { publicUserContext } from "./publicUserContext";
import AGB from "./component/agb";
import DataProtection from "./component/dataProtection";
import { userAuthContext } from "./userAuthContext";
import PrivateRoute from "./privateRoute";
import { supabase } from "./supabase";
import { searchUserContext, type SearchUserObject } from "./searchUserContext";
import Message from "./component/message";
import { messageContext } from "./messageContext";
import type { MessageObject } from "./messageContext";
import { postsContext } from "./postContext";
import { functionContext } from "./functionContext";
import UpadatePassword from "./updatePassword";
import type { PostObject } from "./postContext";
import ForgotPassword from "./forgotPassword";
import Users from "./users";
import { navContext } from "./navContext";
import NewPost from "./newPost";
import type { Session } from "@supabase/supabase-js";
import ErrorPage from "./errorPage";
import Imprint from "./component/imprint";

function App() {
  //const navigation = useNavigate();

  const [postsArray, setPostsArray] = useState<PostObject[]>([]);

  const [publicUserObject, setPublicUserObject] = useState<
    Tables<"public_user">
  >({
    id: 0,
    profil_name: "",
    profil_picture: "",
    status_text: "",
    user_id: "",
    agb_consent: false,
    data_protection_consent: false,
    user_consent: false,
  });

  const [userAuthObject, setUserAuthObject] = useState<Session | null>(null);

  const [globalSearchUserObject, setGlobalSearchUserObject] =
    useState<SearchUserObject>({
      id: 0,
      user_id: "",
      profil_name: "",
      profil_picture: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
      status_text: "",
      search_status: false,
      from_message: false,
    });

  const [messageArray, setMessageArray] = useState<MessageObject[]>([]);

  const [messageCount, setMessageCount] = useState<number>(0);

  const [consentPopUp, setConsentPopUp] = useState<boolean>(false);

  const [currentActiveNavArea, setCurrentActiveNavArea] = useState<string>("");

  useEffect(() => {
    checkUserSession();
    loadFirstUserData();
  }, []);

  async function checkUserSession() {
    const { data: session } = await supabase.auth.getSession();

    console.log(session);
    //console.log(session.session?.user);

    if (session.session) {
      /*const currentSession = session.session;
      const currentSessionUser = session.session.user;
      const currentSessionAppMetadata = session.session.user.app_metadata;*/

      setUserAuthObject(session.session);

      /*setUserAuthObject({
        ...userAuthObject,
        access_token: currentSession.access_token,
        expires_at: currentSession.expires_at!,
        refresh_token: currentSession.refresh_token,
        user: {
          app_metadata: {
            provider: currentSessionAppMetadata.provider!,
            providers: [""],
          },
          aud: currentSessionUser.aud,
          confirmed_at: currentSessionUser.confirmed_at!,
          created_at: currentSessionUser.created_at,
          email: currentSessionUser.email!,
          email_confirmed_at: currentSessionUser.email_confirmed_at!,
          id: currentSessionUser.id,
          identities: [],
          is_anonymous: currentSessionUser.is_anonymous!,
          last_sign_in_at: currentSessionUser.last_sign_in_at!,
          phone: currentSessionUser.phone!,
          role: currentSessionUser.role!,
          updated_at: currentSessionUser.updated_at!,
          user_metadata: {
            email_verified: false,
          },
        },
      });*/
    }
  }

  async function loadFirstUserData() {
    const { data: session } = await supabase.auth.getSession();

    const { data: public_user } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", session.session!.user.id);

    const { count: followCount } = await supabase
      .from("follow")
      .select("*", { count: "exact" })
      .eq("follow", true)
      .eq("follow_user_id", session.session!.user.id)
      .is("follow_request", false)
      .eq("is_seen", false);

    //console.log(followCount);
    //
    if (public_user && public_user?.length > 0) {
      const publicUserData = public_user![0];

      setPublicUserObject({
        ...publicUserObject,
        id: publicUserData.id,
        user_id: session.session!.user.id,
        profil_name: publicUserData.profil_name,
        profil_picture: publicUserData.profil_picture,
        status_text: publicUserData.status_text,
        agb_consent: publicUserData.agb_consent,
        data_protection_consent: publicUserData.data_protection_consent,
        user_consent: publicUserData.user_consent,
      });
    }

    if (followCount) {
      setMessageCount(followCount);
    } else {
      setMessageCount(0);
    }
  }

  /*async function loadAllUserData() {
    console.log("Check");
    const { data: session } = await supabase.auth.getSession();

    const { data: public_user } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", session.session!.user.id);

    if (public_user && public_user?.length > 0) {
      const publicUserData = public_user![0];

      setPublicUserObject({
        ...publicUserObject,
        id: publicUserData.id,
        user_id: session.session!.user.id,
        profil_name: publicUserData.profil_name,
        profil_picture: publicUserData.profil_picture,
        status_text: publicUserData.status_text,
        agb_consent: publicUserData.agb_consent,
        data_protection_consent: publicUserData.data_protection_consent,
        user_consent: publicUserData.user_consent,
      });
    }
  }*/

  async function logOut() {
    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      profil_name: "",
      user_id: "",
      profil_picture: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
    });

    /*setUserAuthObject({
      ...userAuthObject,
      access_token: "",
      expires_at: 0,
      refresh_token: "",
      user: {
        app_metadata: {
          provider: "",
          providers: [""],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: "",
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: {
          email_verified: false,
        },
      },
      weak_password: null,
    });*/

    setGlobalSearchUserObject({
      ...globalSearchUserObject,
      user_id: "",
      profil_name: "",
      profil_picture: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
      status_text: "",
      search_status: false,
      from_message: false,
    });

    setMessageArray([]);

    //navigation("/");
  }

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
          path: "post",
          element: <NewPost />,
        },
        {
          path: "settings/:userId",
          element: <Settings />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "message",
          element: <Message />,
        },
      ],
    },

    {
      path: "imprint",
      element: <Imprint />,
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
    {
      path: "error-page",
      element: <ErrorPage />,
    },
  ]);

  return (
    <navContext.Provider
      value={{
        currentActiveNavArea,
        setCurrentActiveNavArea,
      }}
    >
      <functionContext.Provider
        value={{
          consentPopUp,
          setConsentPopUp,
          checkUserSession,
          loadFirstUserData,
          logOut,
        }}
      >
        <userAuthContext.Provider value={{ userAuthObject, setUserAuthObject }}>
          <publicUserContext.Provider
            value={{ publicUserObject, setPublicUserObject }}
          >
            <searchUserContext.Provider
              value={{ globalSearchUserObject, setGlobalSearchUserObject }}
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
            </searchUserContext.Provider>
          </publicUserContext.Provider>
        </userAuthContext.Provider>
      </functionContext.Provider>
    </navContext.Provider>
  );
}

export default App;
