import { createContext } from "react";

export interface UserInfoObject {
  id: string;
  profilName: string;
}

interface UserInfosContext {
  userInfoObject: UserInfoObject;
  setUserInfoObject: React.Dispatch<React.SetStateAction<UserInfoObject>>;
}

export const userContext = createContext<UserInfosContext>({
  userInfoObject: {
    id: "",
    profilName: "",
  },
  setUserInfoObject: () => {},
});
