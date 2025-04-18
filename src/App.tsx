import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./login";
import SocialMediaOverview from "./socialMediaOverview";
import User from "./user";
import { useState } from "react";
import { userContext } from "./userContext";
import { UserInfoObject } from "./userContext";
import { Tables } from "./database.types";
import { socialMediaPostContext } from "./socialMediaPostContext";

// Create a single supabase client for interacting with your database

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <LogIn />,
      },
      {
        path: "socialMediaOverview",
        element: <SocialMediaOverview />,
      },
      {
        path: "user",
        element: <User />,
      },
    ],
    {
      basename: "/OpenPureNet/",
    }
  );

  const [userInfoObject, setUserInfoObject] = useState<UserInfoObject>({
    id: "",
    profilName: "",
  });

  const [socialMediaPostArray, setSocialMediaPostArray] = useState<
    Tables<"Social-Media-Post-Table">[]
  >([]);

  // Create a single supabase client for interacting with your database

  return (
    <socialMediaPostContext.Provider
      value={{ socialMediaPostArray, setSocialMediaPostArray }}
    >
      <userContext.Provider value={{ userInfoObject, setUserInfoObject }}>
        <div className="social-media-div">
          <RouterProvider router={router} />
        </div>
      </userContext.Provider>
    </socialMediaPostContext.Provider>
  );
  //
}

export default App;
