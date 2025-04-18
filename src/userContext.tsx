import { createContext } from "react";

export interface UserInfoObject {
  userTableId: number;
  authenticatedUserId: string;
  profilName: string;
}

interface UserInfosContext {
  userInfoObject: UserInfoObject;
  setUserInfoObject: React.Dispatch<React.SetStateAction<UserInfoObject>>;
}

export const userContext = createContext<UserInfosContext>({
  userInfoObject: {
    userTableId: 0,
    authenticatedUserId: "",
    profilName: "",
  },
  setUserInfoObject: () => {},
});
