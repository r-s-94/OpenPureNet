import { createContext } from "react";

export interface UserAuthObject {
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface UserAuthSessionObject {
  userAuthObject: UserAuthObject;
  setUserAuthObject: (value: UserAuthObject) => void;
}

export const userAuthContext = createContext<UserAuthSessionObject>({
  userAuthObject: {
    accessToken: "",
    isAuthenticated: false,
  },
  setUserAuthObject: () => {},
});
