import { createContext } from "react";

export interface UserInfoObject {
  userId: string;
  userName: string;
  userProfilName: string;
}

interface UserInfosContext {
  userInfoObject: UserInfoObject;
  setUserInfoObject: React.Dispatch<React.SetStateAction<UserInfoObject>>;
}

export const userContext = createContext<UserInfosContext>({
  userInfoObject: {
    userId: "",
    userName: "",
    userProfilName: "",
  },
  setUserInfoObject: () => {},
});
