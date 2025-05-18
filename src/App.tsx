import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignIn from "./signin";
import Overview from "./overview";
import User from "./user";
import Settings from "./settings";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
    {
      basename: "/OpenPureNet/",
    }
  );

  return (
    <div className="open-pure-net">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
