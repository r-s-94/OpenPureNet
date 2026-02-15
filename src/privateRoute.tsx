import { useContext } from "react";
import { userAuthContext } from "./userAuthContext";
import { Navigate, Outlet } from "react-router-dom";
import ErrorPage from "./errorPage";

export default function PrivateRoute() {
  const { userAuthObject } = useContext(userAuthContext);

  /*useEffect(() => {
    //checkUserSession();
    console.log(userAuthObject);
  }, []);*/

  if (userAuthObject === null) {
    return <ErrorPage />;
  }

  if (userAuthObject !== null) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}
