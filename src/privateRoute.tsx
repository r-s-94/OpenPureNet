import { useContext } from "react";
import { userAuthContext } from "./userAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);

  if (userAuthObject.accessToken === "") {
    return "";
  }

  if (userAuthObject.isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}
